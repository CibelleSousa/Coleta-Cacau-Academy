import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

/** Chave YYYY-MM-DD no fuso LOCAL do servidor. */
function chaveDoDia(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

/**
 * Converte o valor vindo do banco para uma chave de dia local.
 *
 * A coluna é `type: 'date'`, e o driver pg devolve string 'YYYY-MM-DD'.
 * `new Date('2026-11-05')` é interpretado como meia-noite UTC; em fuso
 * negativo (Brasil, UTC-3) isso vira 04/11 às 21h local, e qualquer
 * normalização local depois disso erra o dia. Por isso a string é usada
 * diretamente quando disponível, sem passar por Date.
 */
function chaveDoValorDoBanco(valor: Date | string | null): string | null {
    if (!valor) return null;
    if (typeof valor === 'string') return valor.slice(0, 10);
    return chaveDoDia(valor);
}

/** Diferença em dias entre duas chaves YYYY-MM-DD, interpretadas como locais. */
function diferencaEmDias(de: string, para: string): number {
    const [a1, m1, d1] = de.split('-').map(Number);
    const [a2, m2, d2] = para.split('-').map(Number);
    const inicio = new Date(a1, m1 - 1, d1);
    const fim = new Date(a2, m2 - 1, d2);
    return Math.round((fim.getTime() - inicio.getTime()) / 86_400_000);
}

/**
 * Mantém o contador de dias consecutivos de acesso.
 *
 * Semântica adotada: "dias em que o aluno acessou a plataforma", que é o
 * que o rótulo da interface anuncia. Contar "dias em que estudou" seria uma
 * métrica diferente e está registrada como evolução de produto à parte.
 */
@Injectable()
export class StreakService {
    private readonly logger = new Logger(StreakService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /**
     * Registra um acesso do usuário no dia de hoje.
     *
     * Não faz nada se já houve acesso hoje — o que limita a escrita a, no
     * máximo, uma por usuário por dia, mesmo sendo chamado a cada requisição.
     */
    async registrarAcesso(user: User): Promise<void> {
        const hoje = chaveDoDia(new Date());
        const ultimo = chaveDoValorDoBanco(user.lastLoginDate ?? null);

        if (ultimo === hoje) return;

        if (!ultimo) {
            user.streakCount = 1;
        } else {
            const dias = diferencaEmDias(ultimo, hoje);
            if (dias === 1) {
                user.streakCount += 1;
            } else if (dias > 1) {
                user.streakCount = 1;
            } else {
                // Data futura no banco (relógio alterado, por exemplo).
                // Não mexe na contagem, apenas não quebra.
                return;
            }
        }

        user.lastLoginDate = new Date();

        await this.userRepository.update(user.id, {
            streakCount: user.streakCount,
            lastLoginDate: user.lastLoginDate,
        });

        this.logger.debug(`Streak do usuário ${user.id}: ${user.streakCount} dia(s)`);
    }
}
