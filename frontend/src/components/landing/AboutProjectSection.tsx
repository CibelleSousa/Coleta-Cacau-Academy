import { Sprout, CheckCircle2 } from 'lucide-react';
import styles from './AboutProjectSection.module.css';

export default function AboutProjectSection() {
    const features = [
        'Código real, padrões reais, problemas reais',
        'Foco em offline-first com RealmDB',
        'Gerenciamento de Estado com Redux Toolkit',
        'Aplicativo real como portfólio'
    ];

    return (
        <section className={styles.aboutSection}>
            <div className={styles.container}>
                <div className={styles.textContent}>
                    <p className={styles.labelPrimary}>O projeto</p>
                    <h2 className={styles.title}>O que é o Coleta-Cacau?</h2>
                    <p className={styles.description}>
                        É um aplicativo mobile que digitaliza a coleta de cacau em fazendas — registro de sacas, sincronização offline-first com RealmDB e gerenciamento de estado com Redux Toolkit — Você vai construir
                        esse app por inteiro enquanto aprende React Native, com qualidade de produto que roda no
                        dia-a-dia da agricultura.
                    </p>
                    <ul className={styles.list}>
                        {features.map((t) => (
                        <li key={t} className={styles.listItem}>
                            <CheckCircle2 size={20} className={styles.icon} />
                            <span className={styles.listText}>{t}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.mockupWrapper}>
                    <div className={styles.mockupCard}>
                        <div className={styles.phoneFrame}>
                            <div className={styles.phoneScreen}>
                                <div className={styles.phoneHeader}>
                                    <Sprout size={16} className={styles.phoneIcon} /> Coleta-Cacau
                                </div>
                                <div className={styles.phoneList}>
                                    <div className={styles.phoneItemActive}>Talhão A · 32 sacas</div>
                                    <div className={styles.phoneItem}>Talhão B · 18 sacas</div>
                                    <div className={styles.phoneItem}>Talhão C · 24 sacas</div>
                                </div>
                                <div className={styles.phoneButton}>
                                    + Registrar coleta
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
