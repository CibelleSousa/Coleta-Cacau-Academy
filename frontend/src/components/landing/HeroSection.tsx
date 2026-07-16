import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import GoogleIcon from './GoogleIcon';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    const stats = [
        { n: '6', l: 'Módulos teóricos' },
        { n: '1', l: 'Módulo prático' },
        { n: '1', l: 'App real' },
    ];

    return (
        <section className={styles.heroSection}>
            <div className={styles.heroBg}></div>
            <div className={styles.heroContainer}>
                <h1 className={styles.heroTitle}>
                    Domine <span className={styles.textPrimary}>React Native</span><br />
                    construindo um App Real para o Campo
                </h1>
                <p className={styles.heroSubtitle}>
                    Aprenda mobile do zero desenvolvendo o <strong className={styles.strongText}>Coleta-Cacau</strong>,
                    um aplicativo de coleta de dados usado de verdade por produtores rurais.
                </p>
                <div className={styles.ctaContainer}>
                    <Link href="/login" className={styles.ctaButton}>
                        <GoogleIcon /> Entrar com Google para Começar
                        <ArrowRight size={16} />
                    </Link>
                    <span className={styles.ctaNote}>Acesso imediato • <strong className={styles.strongText}>Gratuito</strong></span>
                </div>
                <div className={styles.statsContainer}>
                    {stats.map((s) => (
                        <div key={s.l}>
                        <p className={styles.statNumber}>{s.n}</p>
                        <p className={styles.statLabel}>{s.l}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
