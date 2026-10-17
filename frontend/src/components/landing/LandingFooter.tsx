import Link from 'next/link';
import Image from 'next/image';
import { Sprout } from 'lucide-react';
import styles from './LandingFooter.module.css';
import logoImage from '../../assets/logo.png';

export default function LandingFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brandContainer}>
                    <Image 
                        src={logoImage}
                        alt='Logo Coleta-Cacau'
                        width={30}
                        height={30}
                        style={{objectFit: 'contain'}}
                    />
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
