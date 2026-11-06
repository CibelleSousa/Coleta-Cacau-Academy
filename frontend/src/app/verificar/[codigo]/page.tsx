import Link from 'next/link';
import { Award, CheckCircle2, XCircle } from 'lucide-react';
import styles from './page.module.css';

interface Verificacao {
    valid: boolean;
    studentName: string;
    course: string;
    issuedAt: string;
    verificationCode: string;
}

/**
 * Consulta o backend em tempo de requisição.
 *
 * Server Component de propósito: a verificação é consultada por terceiros
 * (empregador, coordenação) que não têm sessão. Renderizar no servidor
 * evita exigir JavaScript e entrega a resposta já pronta.
 */
async function verificar(codigo: string): Promise<Verificacao | null> {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
        const res = await fetch(`${api}/certificates/verify/${encodeURIComponent(codigo)}`, {
            // Um certificado pode ser revogado; não queremos servir cache
            // afirmando validade de algo que deixou de valer.
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return (await res.json()) as Verificacao;
    } catch {
        // API fora do ar é indistinguível de código inválido para quem vê a
        // página; ambos caem no estado de "não foi possível confirmar".
        return null;
    }
}

export default async function VerificarPage({
    params,
}: {
    params: Promise<{ codigo: string }>;
}) {
    const { codigo } = await params;
    const dados = await verificar(codigo);

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconBox}>
                    <Award size={32} />
                </div>

                {dados ? (
                    <>
                        <p className={styles.statusValido}>
                            <CheckCircle2 size={16} /> Certificado autêntico
                        </p>
                        <h1 className={styles.nome}>{dados.studentName}</h1>
                        <p className={styles.texto}>concluiu o curso</p>
                        <h2 className={styles.curso}>{dados.course}</h2>
                        <dl className={styles.meta}>
                            <div>
                                <dt>Emitido em</dt>
                                <dd>
                                    {new Date(dados.issuedAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </dd>
                            </div>
                            <div>
                                <dt>Código</dt>
                                <dd className={styles.codigo}>{dados.verificationCode}</dd>
                            </div>
                        </dl>
                    </>
                ) : (
                    <>
                        <p className={styles.statusInvalido}>
                            <XCircle size={16} /> Não foi possível confirmar
                        </p>
                        <h1 className={styles.nome}>Certificado não encontrado</h1>
                        <p className={styles.texto}>
                            O código informado não corresponde a nenhum certificado emitido.
                            Confira se foi digitado corretamente, exatamente como aparece no PDF.
                        </p>
                        <p className={styles.codigo}>{codigo}</p>
                    </>
                )}

                <Link href="/" className={styles.voltar}>
                    Conhecer a Coleta-Cacau Academy
                </Link>
            </div>
        </main>
    );
}
