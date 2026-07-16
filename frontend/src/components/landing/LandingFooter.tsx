import Link from 'next/link';
import { Sprout } from 'lucide-react';
import styles from './LandingFooter.module.css';

export default function LandingFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brandContainer}>
                    <Sprout size={16} className={styles.icon} />
                    <span>© 2026 Coleta-Cacau Academy</span>
                </div>
                <div className={styles.linksContainer}>
                    <Link href="/" className={styles.link}>Sobre</Link>
                    <a href="#" className={styles.link}>Contato</a>
                    <a href="#" className={styles.link}>Termos</a>
                </div>
            </div>
        </footer>
    );
}
