'use client';

import { useState } from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
    src?: string | null;
    name?: string | null;
    className?: string;
    style?: React.CSSProperties;
}

export default function Avatar({ src, name, className, style }: AvatarProps) {
    const [hasError, setHasError] = useState(false);

    // Extrai as duas primeiras iniciais do nome, ou fallback para '?'
    const initials = name 
        ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() 
        : '?';

    // Se passar uma classe do CSS Module pai (ex: styles.userAvatar), ela mescla com a base
    const combinedClassName = className ? `${className} ${styles.base}` : styles.base;

    if (src && !hasError) {
        return (
            <img 
                src={src} 
                alt={name || 'Avatar'} 
                className={combinedClassName}
                style={style}
                onError={() => setHasError(true)} 
            />
        );
    }

    return (
        <div className={`${combinedClassName} ${styles.fallback}`} style={style}>
            {initials}
        </div>
    );
}
