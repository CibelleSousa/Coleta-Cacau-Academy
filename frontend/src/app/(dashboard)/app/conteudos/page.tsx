'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useGetModulesQuery } from '@/services/api';
import ModuleList from '@/components/features/ModuleList';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';

export default function Conteudos() {
    const { data: modules = [], isLoading, isError } = useGetModulesQuery();

    // Filter only THEORY modules from the real Redux state
    const theoryModules = modules
        .filter(m => m.type === 'THEORY')
        .sort((a, b) => a.order -b.order);
    
    const sortedLessons = theoryModules.flatMap(m => {
        return [...m.lessons].sort((a,b) => a.order - b.order)
    });

    const doneCount = sortedLessons.filter(l => l.done).length;
    const totalCount = sortedLessons.length;
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    // Find the first incomplete lesson for the "Continue" button
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
                    <Skeleton style={{ width: '60px', height: '12px', marginBottom: '0.5rem' }} />
                    <Skeleton style={{ width: '360px', height: '24px', marginBottom: '0.5rem' }} />
                    <Skeleton style={{ width: '320px', height: '14px', marginBottom: '1.5rem' }} />
                    <div className={styles.progressRow}>
                        <div className={styles.progressInfo}>
                            <Skeleton style={{ width: '100%', height: '12px', borderRadius: '9999px' }} />
                            <Skeleton style={{ width: '160px', height: '12px' }} />
                        </div>
                        <Skeleton style={{ width: '190px', height: '36px', borderRadius: '0.5rem' }} />
                    </div>
                </div>
            ) : (
                <div className={styles.headerCard}>
                    <p className={styles.labelPrimary}>Curso</p>
                    <h1 className={styles.titleHeader}>React Native do zero — Trilha Teórica</h1>
                    <p className={styles.subtitle}>Fundamentos sólidos para construir aplicativos mobile de verdade.</p>
                    
                    <div className={styles.progressRow}>
                        <div className={styles.progressInfo}>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                            </div>
                            <p className={styles.progressText}>{doneCount} de {totalCount} aulas concluídas · {pct}%</p>
                        </div>
                        {continueLessonId ? (
                            <Link 
                                href={`/app/licao/${continueLessonId}`} 
                                className={styles.btnPrimary}
                            >
                                Continuar de onde parei <ArrowRight size={16} />
                            </Link>
                        ) : (
                            <button disabled className={styles.btnPrimaryDisabled}>
                                Continuar de onde parei <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Module List */}
            <h2 className={styles.sectionTitle}>Módulos</h2>
            <ModuleList type="THEORY" />
        </div>
    );
}
