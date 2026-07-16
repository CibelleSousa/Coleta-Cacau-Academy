'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, CheckCircle2, Circle, FileText, Play, Lock } from 'lucide-react';
import { useGetModulesQuery } from '@/services/api';
import { CourseModule } from '@/store/slices/coursesSlice';
import Skeleton from '../ui/Skeleton';
import styles from './ModuleList.module.css';

export default function ModuleList({ type }: { type: 'THEORY' | 'PRACTICAL' }) {
    const { data: modules = [], isLoading, isError } = useGetModulesQuery();

    const filteredModules = useMemo(() => {
        return modules
            .filter((m: CourseModule) => m.type === type)
            .sort((a, b) => a.order - b.order);
    }, [modules, type]);

    const [openId, setOpenId] = useState<string | null>(null);

    // Open the first incomplete module by default when data is loaded
    useEffect(() => {
        if (!isLoading && filteredModules.length > 0 && !openId) {
            const firstOpenModule = filteredModules.find(m => m.lessons.some(l => !l.done))?.id ?? filteredModules[0]?.id;
            if (firstOpenModule) {
                setOpenId(firstOpenModule);
            }
        }
    }, [isLoading, filteredModules, openId]);

    if (isLoading) {
        return (
            <div className={styles.listContainer}>
                {[1, 2, 3].map(i => (
                    <div key={i} className={styles.moduleCard}>
                        <div className={styles.moduleHeader}>
                            <Skeleton className={styles.moduleIconBox} />
                            <div className={styles.moduleHeaderText}>
                                <Skeleton className={styles.skeletonTitle} />
                                <Skeleton className={styles.skeletonDesc} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.listContainer}>
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>Erro ao carregar módulos. Verifique sua conexão ou se você está autenticado.</p>
                </div>
            </div>
        );
    }

    if (filteredModules.length === 0) {
        return (
            <div className={styles.listContainer}>
                <p className={styles.mutedText}>Nenhum módulo encontrado.</p>
            </div>
        );
    }

    return (
        <div className={styles.listContainer}>
            {filteredModules.map((m) => {
                const isOpen = openId === m.id;
                const total = m.lessons.length;
                const done = m.lessons.filter(l => l.done).length;
                const complete = done === total;

                return (
                    <div key={m.id} className={styles.moduleCard}>
                        <button 
                            className={styles.moduleHeader} 
                            onClick={() => setOpenId(isOpen ? null : m.id)}
                        >
                            <div className={`${styles.moduleIconBox} ${complete ? styles.moduleIconBoxComplete : ''}`}>
                                {complete ? <CheckCircle2 size={20} /> : <span className={styles.moduleProgressText}>{done}/{total}</span>}
                            </div>
                            <div className={styles.moduleHeaderText}>
                                <h3 className={styles.moduleTitle}>{m.title}</h3>
                                <p className={styles.moduleDesc}>{m.description}</p>
                            </div>
                            <ChevronDown size={20} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
                        </button>

                        {isOpen && (
                            <div className={styles.moduleContent}>
                                <div className={styles.lessonList}>
                                    {m.lessons.map((l) => (
                                        <Link 
                                            key={l.id} 
                                            href={`/app/${type === 'PRACTICAL' ? 'aula' : 'licao'}/${l.id}`} 
                                            className={styles.lessonRow}
                                        >
                                            <div className={styles.lessonStatusIcons}>
                                                {l.done ? 
                                                    <CheckCircle2 
                                                        size={20} 
                                                        className={styles.iconDone} 
                                                    /> : 
                                                    <Circle 
                                                        size={20} 
                                                        className={styles.iconPending} 
                                                    />
                                                }
                                                <div className={styles.lessonTypeIcon}>
                                                    {type === 'PRACTICAL' ? <Play size={14} /> : <FileText size={14} />}
                                                </div>
                                            </div>
                                            <div className={styles.lessonTextContainer}>
                                                <p className={`${styles.lessonTitle} ${l.done ? styles.lessonTitleDone : ''}`}>{l.title}</p>
                                                <p className={styles.lessonTime}>{l.duration}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                
                                <div className={styles.moduleFooter}>
                                    {complete ? (
                                        <Link 
                                            href={`/app/quiz/${m.id}`} 
                                            className={`${styles.quizButton} ${styles.quizButtonActive}`}
                                        >
                                            <CheckCircle2 size={16} />
                                            Quiz do capítulo
                                        </Link>
                                    ) : (
                                        <button 
                                            disabled
                                            className={`${styles.quizButton} ${styles.quizButtonLocked}`}
                                        >
                                            <Lock size={16} />
                                            Quiz do capítulo
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}