'use-client';

import styles from './PageError.module.css';

interface PageErrorProps {
    message?: string;
}

export function ErrorFound ({ message } : PageErrorProps) {
    return (
        <div className={styles.errorContainer}>
            <p className={styles.errorText}>{message}</p>
        </div>
    );
}

export function NotFound ({ message }: PageErrorProps) {
    return(
        <p className={styles.mutedText}>{message}</p>
    );
}