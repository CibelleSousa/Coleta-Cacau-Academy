'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Award } from 'lucide-react';
import { useGetModulesQuery } from '@/services/api';
import ModuleList from '@/components/features/ModuleList';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';

export default function PraticoPage() {
    const { data: modules = [], isLoading, isError } = useGetModulesQuery();

    // Filter only PRACTICAL modules from the real Redux state
    const practicalModules = modules
        .filter(m => m.type === 'PRACTICAL')
        .sort((a, b) => a.order - b.order);
    
    const sortedLessons = practicalModules.flatMap(m => 
        [...m.lessons].sort((a, b) => a.order - b.order)
    );

    const doneCount = sortedLessons.filter(l => l.done).length;
    const totalCount = sortedLessons.length;
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    const allDone = doneCount === totalCount && totalCount > 0;

    // Find the first incomplete video lesson for the "Continue" button
    const nextLesson = sortedLessons.find(l => !l.done);
    const continueLessonId = nextLesson?.id || sortedLessons[0]?.id;

    if (isError) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>Erro ao carregar dados da API.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Header Card */}
            {isLoading ? (
                <div className={styles.headerCard}>
                    <Skeleton style={{ width: '110px', height: '12px', marginBottom: '0.5rem' }} />
                    <Skeleton style={{ width: '320px', height: '24px', marginBottom: '0.5rem' }} />
                    <Skeleton style={{ width: '340px', height: '14px', marginBottom: '1.5rem' }} />
                    <div className={styles.progressRow}>
                        <div className={styles.progressInfo}>
                            <Skeleton style={{ width: '100%', height: '12px', borderRadius: '9999px' }} />
                            <Skeleton style={{ width: '150px', height: '12px' }} />
                        </div>
                        <Skeleton style={{ width: '150px', height: '36px', borderRadius: '0.5rem' }} />
                    </div>
                </div>
            ) : (
                <div className={styles.headerCard}>
                    <p className={styles.labelPrimary}>Projeto Prático</p>
                    <h1 className={styles.titleHeader}>Construindo o app Coleta-Cacau</h1>
                    <p className={styles.subtitle}>Videoaulas guiadas, do setup até o projeto final.</p>
                    
                    <div className={styles.progressRow}>
                        <div className={styles.progressInfo}>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                            </div>
                            <p className={styles.progressText}>{doneCount} de {totalCount} vídeos · {pct}%</p>
                        </div>
                        {continueLessonId ? (
                            <Link href={`/app/aula/${continueLessonId}`} className={styles.btnPrimary}>
                                Continuar prática <ArrowRight size={16} />
                            </Link>
                        ) : (
                            <button disabled className={styles.btnPrimaryDisabled}>
                                Continuar prática <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Modules List */}
            <h2 className={styles.sectionTitle}>Trilha de vídeos</h2>
            <ModuleList type="PRACTICAL" />

            {/* Final Evaluation Teaser */}
            {isLoading ? (
                <div className={styles.evalCard}>
                    <div className={styles.evalIconBox}>
                        <Skeleton style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                    </div>
                    <div className={styles.evalTextContainer}>
                        <Skeleton style={{ width: '240px', height: '16px', marginBottom: '0.25rem' }} />
                        <Skeleton style={{ width: '200px', height: '14px' }} />
                    </div>
                    <Skeleton style={{ width: '140px', height: '36px', borderRadius: '0.5rem' }} />
                </div>
            ) : (
                <div className={styles.evalCard}>
                    <div className={styles.evalIconBox}>
                        <Award size={24} />
                    </div>
                    <div className={styles.evalTextContainer}>
                        <h3 className={styles.evalTitle}>Avaliação Final para Certificação</h3>
                        <p className={styles.evalSubtitle}>Disponível ao concluir todos os vídeos.</p>
                    </div>
                    {allDone ? (
                        <Link 
                            href="/app/quiz/final" 
                            className={`${styles.evalButton} ${styles.evalButtonActive}`}
                        >
                            Iniciar avaliação
                        </Link>
                    ) : (
                        <button 
                            disabled
                            className={`${styles.evalButton} ${styles.evalButtonLocked}`}
                        >
                            Bloqueado
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}