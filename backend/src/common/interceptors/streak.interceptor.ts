import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../database/entities/user.entity';
import { StreakService } from '../../modules/users/streak.service';

/**
 * Registra o acesso diário do usuário em qualquer requisição autenticada.
 *
 * Antes, a streak só era atualizada no fluxo OAuth do Google. Como o JWT
 * dura um dia, quem voltava ao site com cookie válido não passava por lá —
 * o contador media expirações de cookie, não dias de acesso.
 *
 * Interceptors rodam DEPOIS dos guards no Nest, então `request.user` já foi
 * populado pelo JwtAuthGuard (ou pelo GoogleOAuthGuard, no callback).
 *
 * O serviço ignora chamadas repetidas no mesmo dia, então o custo real é de
 * no máximo uma escrita por usuário por dia.
 */
@Injectable()
export class StreakInterceptor implements NestInterceptor {
    private readonly logger = new Logger(StreakInterceptor.name);

    constructor(private readonly streakService: StreakService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest<{ user?: User }>();
        const user = request.user;

        if (user?.id) {
            // Deliberadamente sem await: registrar presença não pode atrasar
            // nem derrubar a resposta ao usuário. O catch é obrigatório —
            // uma promise rejeitada sem tratamento encerraria o processo.
            this.streakService.registrarAcesso(user).catch((error) => {
                this.logger.error(
                    `Falha ao registrar acesso do usuário ${user.id}`,
                    error instanceof Error ? error.stack : String(error),
                );
            });
        }

        return next.handle();
    }
}
