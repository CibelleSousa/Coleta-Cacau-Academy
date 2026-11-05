'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Code2, PlayCircle, Award, FileUp, DatabaseZap, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CourseCurriculum.module.css';

const curriculum = [
    { icon: BookOpen, title: 'Fundamentos', kicker: "A base de tudo", desc: 'Componentes, Flexbox, listas, navegação e formulários — a base do React Native.', topics: ["Componentes", "Flexbox", "FlatList", "Navegação", "Formulários"] },
    { icon: Code2, title: 'Construção do App', kicker: "Mão na massa", desc: 'Telas reais do coleta-cacau, exportação de dados e sincronização offline.', topics: ["Telas reais", "Offline-first", "RealmDB", "Sincronização"] },
    { icon: DatabaseZap, title: 'Arquitetura Mobile-first', kicker: "Pensar como produto", desc: 'Performance, gestão de estado e UX adaptada a quem usa botas no campo.', topics: ["Redux Toolkit", "Performance", "UX de campo"] },
    { icon: FileUp, title: 'Exportação de Dados', kicker: "Do campo ao escritório", desc: 'Gere  e exporte uma planilha excel da coleta via WhatsApp.', topics: ["Excel", "Compartilhamento", "WhatsApp"] },
    { icon: PlayCircle, title: 'Videoaulas guiadas', kicker: "Linha por linha", desc: 'Acompanhe linha por linha cada implementação com vídeos comentados.', topics: ["Vídeos comentados", "Código-fonte", "Desafios"] },
    { icon: Award, title: 'Certificação', kicker: "A linha de chegada", desc: 'Avaliação final + projeto entregue = certificado de participação.', topics: ["Avaliação final", "Projeto entregue", "Certificado"] },
];

const duration = 6000;

export default function CourseCurriculum() {
    const [ active, setActive ] = useState(0);
    const [ paused, setPaused ] = useState(false);

    const go = (i: number) => setActive((i + curriculum.length) % curriculum.length);

    useEffect(() => {
        if (paused) return;
        const t = setTimeout(() => go(active + 1), duration);
        return () => clearTimeout(t);
    }, [active, paused]);

    const c = curriculum[active];
    const Icon = c.icon;

    return (
        <section className={styles.curriculumSection}>
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <p className={styles.labelPrimary}>Currículo</p>
                    <h2 className={styles.title}>Teoria + Prática</h2>
                    <p className={styles.subtitle}>
                        Cada conceito teórico é reforçado por uma videoaula construindo a feature equivalente no app real.
                    </p>
                </div>
                <div 
                    className={styles.carouselWrapper}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <ol className={styles.track}>
                        {curriculum.map((mod, i) => {
                            const on = i === active;
                            return (
                                <li key={mod.title} className={styles.trackItem}>
                                    <button
                                        onClick={() => go(i)}
                                        className={`${styles.trackButton} ${on ? styles.trackButtonActive : ''}`}
                                    >
                                        <span className={`${styles.trackNum} ${on ? styles.trackNumActive : styles.trackNumInactive}`}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className={`${styles.trackTitle} ${on ? styles.trackTitleActive : styles.trackTitleInactive}`}>
                                            {mod.title}
                                        </span>
                                        {on && (
                                            <span
                                                key={`${active}`}
                                                className={`${styles.progressBar} ${paused ? styles.progressBarPaused : ''}`}
                                            />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>

                    <div className={styles.stage}>
                        <span key={`n-${active}`} aria-hidden className={styles.stageBgNum}>
                            {String(active + 1).padStart(2, "0")}
                        </span>
                        
                        <div className={styles.blurBlob1} />
                        <div className={styles.blurBlob2} />

                        <div key={active} className={styles.stageContent}>
                            <div className={styles.stageHeader}>
                                <span className={styles.stageIconBox}>
                                    <Icon size={32} />
                                </span>
                                <span className={styles.stageSubtitle}>
                                    MÓDULO {active + 1} / {curriculum.length}
                                </span>
                            </div>
                            <p className={styles.stageKicker}>{c.kicker}</p>
                            <h3 className={styles.stageTitle}>{c.title}</h3>
                            <p className={styles.stageDesc}>{c.desc}</p>
                            
                            <ul className={styles.topicsList}>
                                {c.topics.map((t) => (
                                    <li key={t} className={styles.topicItem}>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.navButtons}>
                            <button aria-label="Anterior" onClick={() => go(active - 1)} className={styles.btnPrev}>
                                <ChevronLeft size={20} />
                            </button>
                            <button aria-label="Próximo" onClick={() => go(active + 1)} className={styles.btnNext}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
