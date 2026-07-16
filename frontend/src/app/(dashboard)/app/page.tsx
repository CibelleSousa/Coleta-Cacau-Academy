'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, PlayCircle, Award, Flame } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useGetModulesQuery } from '@/services/api';
import { CourseModule } from '@/store/slices/coursesSlice';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';

export default function DashboardHome() {
    const user = useAppSelector((state) => state.auth);
    const { data: modules = [], isLoading, isError } = useGetModulesQuery();
    const firstName = user.name ? user.name.split(' ')[0] : 'Aluno';

    // --- Dynamic Data Calculation ---
    const allLessons = modules.flatMap(m => m.lessons);

    const theoryLessons = modules.filter(m => m.type === 'THEORY').flatMap(m => m.lessons);
    const theoryDone = theoryLessons.filter(l => l.done).length;
    const theoryPct = theoryLessons.length > 0 ? Math.round((theoryDone / theoryLessons.length) * 100) : 0;

    const videoLessons = modules.filter(m => m.type === 'PRACTICAL').flatMap(m => m.lessons);
    const videoDone = videoLessons.filter(l => l.done).length;
    const videoPct = videoLessons.length > 0 ? Math.round((videoDone / videoLessons.length) * 100) : 0;

    const nextLessonItem = allLessons.find(l => !l.done);
    const nextLessonModule = nextLessonItem ? modules.find(m => m.lessons.some(l => l.id === nextLessonItem.id)) : null;

    // --- Render States ---
    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <Skeleton style={{ width: '180px', height: '16px', marginBottom: '8px' }} />
                        <Skeleton style={{ width: '220px', height: '28px' }} />
                    </div>
                    <Skeleton style={{ width: '140px', height: '32px', borderRadius: '9999px' }} />
                </div>
                
                <div className={styles.continueCard}>
                    <Skeleton style={{ width: '140px', height: '14px', marginBottom: '12px' }} />
                    <Skeleton style={{ width: '280px', height: '24px', marginBottom: '8px' }} />
                    <Skeleton style={{ width: '200px', height: '16px', marginBottom: '24px' }} />
                    <Skeleton style={{ width: '160px', height: '40px', borderRadius: '8px' }} />
                </div>
                
                <div className={styles.grid}>
                    <div className={styles.progressCard}>
                        <div className={styles.cardHeader} style={{ marginBottom: '16px' }}>
                            <Skeleton style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                            <Skeleton style={{ width: '100px', height: '14px' }} />
                        </div>
                        <Skeleton style={{ width: '140px', height: '20px', marginBottom: '16px' }} />
                        <Skeleton style={{ width: '100%', height: '12px', borderRadius: '9999px', marginBottom: '8px' }} />
                        <Skeleton style={{ width: '80px', height: '12px' }} />
                    </div>
                    <div className={styles.progressCard}>
                        <div className={styles.cardHeader} style={{ marginBottom: '16px' }}>
                            <Skeleton style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                            <Skeleton style={{ width: '100px', height: '14px' }} />
                        </div>
                        <Skeleton style={{ width: '140px', height: '20px', marginBottom: '16px' }} />
                        <Skeleton style={{ width: '100%', height: '12px', borderRadius: '9999px', marginBottom: '8px' }} />
                        <Skeleton style={{ width: '80px', height: '12px' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.container}>
                <h1 className={styles.userName}>Erro ao carregar dados.</h1>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
                    Não foi possível buscar seus módulos.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <p className={styles.welcomeText}>Bom te ver de volta,</p>
                    <h1 className={styles.userName}>{firstName} 🌱</h1>
                </div>
                <div className={styles.streakBadge}>
                    <Flame size={16} style={{ color: 'var(--primary)' }} /> {user.streakCount || 0} dias seguidos
                </div>
            </div>

            {/* Continue Card */}
            {nextLessonItem && nextLessonModule && (
                <div className={styles.continueCard}>
                    <p className={styles.labelSmall}>Continue de onde parou</p>
                    <h2 className={styles.titleLarge}>{nextLessonItem.title}</h2>
                    <p className={styles.subtitleSmall}>{nextLessonModule.title}</p>
                    <Link href={`/app/${nextLessonItem.type === 'video' ? 'aula' : 'licao'}/${nextLessonItem.id}`} className={styles.continueBtn}>
                        Continuar aula <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {/* Progress Grid */}
            <div className={styles.grid}>
                <Link href="/app/conteudos" className={styles.progressCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.iconBox}>
                            <BookOpen size={20} />
                        </div>
                        <span className={styles.progressText}>{theoryDone}/{theoryLessons.length} aulas</span>
                    </div>
                    <h3 className={styles.cardTitle}>Aulas Teóricas</h3>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBarFill} style={{ width: `${theoryPct}%` }} />
                    </div>
                    <p className={styles.progressText} style={{ marginTop: '0.5rem' }}>{theoryPct}% concluído</p>
                </Link>

                <Link href="/app/pratico" className={styles.progressCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.iconBox}>
                            <PlayCircle size={20} />
                        </div>
                        <span className={styles.progressText}>{videoDone}/{videoLessons.length} vídeos</span>
                    </div>
                    <h3 className={styles.cardTitle}>Projeto Prático</h3>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBarFill} style={{ width: `${videoPct}%` }} />
                    </div>
                    <p className={styles.progressText} style={{ marginTop: '0.5rem' }}>{videoPct}% concluído</p>
                </Link>
            </div>

            {/* Certification Teaser */}
            <div className={styles.certCard}>
                <div className={styles.certIconBox}>
                    <Award size={24} />
                </div>
                <div className={styles.certTextContainer}>
                    <h3 className={styles.cardTitle}>
                        {(theoryPct === 100 && videoPct === 100) ? 'Certificado Liberado! 🎓' : 'Certificado em construção'}
                    </h3>
                    <p className={styles.subtitleSmall}>
                        {(theoryPct === 100 && videoPct === 100) ? 'Parabéns! Você já pode emitir seu certificado.' : 'Conclua todos os módulos para emitir.'}
                    </p>
                </div>
                <Link href="/app/certificados" className={styles.certLink}>
                    Ver
                </Link>
            </div>
        </div>
    );
}
