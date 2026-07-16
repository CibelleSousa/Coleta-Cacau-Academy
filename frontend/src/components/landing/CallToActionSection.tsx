import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import GoogleIcon from './GoogleIcon';
import styles from './CallToActionSection.module.css';

export default function CallToActionSection() {
    return (
        <section className={styles.ctaSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>
                    Pronto pra construir software de verdade?
                </h2>
                <p className={styles.subtitle}>
                    Sem boilerplate genérico. Você sai com um app no portfólio e domínio real do React Native.
                </p>
                <Link href="/login" className={styles.ctaButton}>
                    <GoogleIcon /> Começar agora <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}
