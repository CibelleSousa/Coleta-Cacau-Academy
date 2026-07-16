'use client';

import { useState } from 'react';
import { useGetModulesQuery,useGetMeQuery } from '@/services/api';
import { Award, Lock, Download } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';

export default function CertificadosPage() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();
    const { data: modules = [], isLoading } = useGetModulesQuery();
    const [isDownloading, setIsDownloading] = useState(false);

    // Calculate overall completion across ALL lessons
    const allLessons = modules.flatMap(m => m.lessons);
    const totalLessons = allLessons.length;
    const doneLessons = allLessons.filter(l => l.done).length;
    
    const overallProgress = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
    const unlocked = overallProgress === 100 && totalLessons > 0;

    const handleDownloadCertificate = async () => {
        setIsDownloading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/certificates/issue`, {
                method: 'GET',
                credentials: 'include',
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Certificado de Conclusao - Desenvolvimento Mobile com React Native.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error('Failed to download certificate');
            }
            } catch (error) {
                console.error('Error downloading certificate:', error);
            } finally {
                setIsDownloading(false);
            }
    };

    if (isLoading || isUserLoading) {
        return (
            <div className={styles.pageContainer}>
                <Skeleton style={{ width: '220px', height: '36px', marginBottom: '4px' }} />
                <Skeleton style={{ width: '280px', height: '14px' }} />

                <div className={styles.certWrapper}>
                    <div className={styles.certInner}>
                        <div className={styles.certHeader}>
                            <div>
                                <Skeleton style={{ width: '80px', height: '12px', marginBottom: '0.5rem' }} />
                                <Skeleton style={{ width: '320px', height: '30px', marginBottom: '0.5rem' }} />
                                <Skeleton style={{ width: '100px', height: '14px', marginBottom: '4px' }} />
                                <Skeleton style={{ width: '160px', height: '20px' }} />
                            </div>
                            <Skeleton style={{ width: '80px', height: '80px', borderRadius: '1rem' }} />
                        </div>

                        <div className={styles.progressSection}>
                            <Skeleton style={{ width: '100%', height: '8px', borderRadius: '9999px' }} />
                            <Skeleton style={{ width: '160px', height: '12px', marginTop: '0.5rem' }} />
                        </div>

                        <Skeleton style={{ width: '180px', height: '38px', borderRadius: '0.5rem', marginTop: '1.5rem' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Seus certificados</h1>
            <p className={styles.pageSubtitle}>Conclua todas as trilhas para liberar a emissão.</p>

            <div className={styles.certWrapper}>
                <div className={styles.certInner}>
                    <div className={styles.certHeader}>
                        <div>
                            <p className={styles.certLabel}>Certificado</p>
                            <h2 className={styles.certTitle}>React Native — Coleta-Cacau Academy</h2>
                            <p className={styles.certSubtitle}>Concedido a</p>
                            <p className={styles.certUserName}>{user?.name || '—'}</p>
                        </div>
                        <div className={styles.certIconBox}>
                            <Award size={40} />
                        </div>
                    </div>

                    <div className={styles.progressSection}>
                        <div className={styles.progressTrack}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${overallProgress}%` }} 
                            />
                        </div>
                        <p className={styles.progressText}>Progresso geral · {overallProgress}%</p>
                    </div>

                    {unlocked ? (
                        <button 
                            onClick={handleDownloadCertificate} 
                            disabled={isDownloading}
                            className={styles.downloadBtn}
                        >
                            <Download size={16} />
                            {isDownloading ? 'Gerando PDF...' : 'Baixar Certificado'}
                        </button>
                    ) : (
                        <button disabled className={styles.lockedBtn}>
                            <Lock size={16} />
                            Bloqueado — conclua o curso
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
