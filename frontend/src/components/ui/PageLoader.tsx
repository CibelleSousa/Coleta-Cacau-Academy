'use client';

import Spinner from './Spinner';
import styles from './PageLoader.module.css';

interface PageLoaderProps {
    message?: string;
}

export default function PageLoader({ message = 'Carregando...' }: PageLoaderProps) {
    return (
        <div className={styles.container}>
            <Spinner size={48} />
            <p className={styles.message}>{message}</p>
        </div>
    );
}
