'use client';

import styles from './Skeleton.module.css';

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties
}

export default function Skeleton({ className, style }: SkeletonProps) {
    return <div className={`${styles.skeleton} ${className || ''}`} style={style} />;
}
