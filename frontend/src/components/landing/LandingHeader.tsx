import Link from 'next/link';
import { Sprout } from 'lucide-react';
import GoogleIcon from './GoogleIcon';
import ThemeToggle from './ThemeToggle';
import styles from './LandingHeader.module.css';

export default function LandingHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.brandContainer}>
                <div className={styles.logoBox}>
                    <Sprout size={24} />
                </div>
                <div className={styles.brandText}>
                    <p className={styles.brandName}>Coleta-Cacau</p>
                    <p className={styles.brandSubtitle}>Academy</p>
                </div>
                </div>
                <div className={styles.actionsGroup}>
                    <ThemeToggle />
                    <a href="/login" className={styles.loginButton}>
                        <GoogleIcon /> Entrar
                    </a>
                </div>
            </div>
        </header>
    );
}