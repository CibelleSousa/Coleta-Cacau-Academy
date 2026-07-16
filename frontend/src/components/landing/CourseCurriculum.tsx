import { BookOpen, Code2, PlayCircle, Award, FileUp, DatabaseZap } from 'lucide-react';
import styles from './CourseCurriculum.module.css';

export default function CourseCurriculum() {
  const curriculum = [
    { icon: BookOpen, title: 'Fundamentos', desc: 'Componentes, Flexbox, listas, navegação e formulários — a base do React Native.' },
    { icon: Code2, title: 'Construção do App', desc: 'Telas reais do coleta-cacau, exportação de dados e sincronização offline.' },
    { icon: DatabaseZap, title: 'Arquitetura Mobile-first', desc: 'Performance, gestão de estado e UX adaptada a quem usa botas no campo.' },
    { icon: FileUp, title: 'Exportação de Dados', desc: 'Gere  e exporte uma planilha excel da coleta via WhatsApp.' },
    { icon: PlayCircle, title: 'Videoaulas guiadas', desc: 'Acompanhe linha por linha cada implementação com vídeos comentados.' },
    { icon: Award, title: 'Certificação', desc: 'Avaliação final + projeto entregue = certificado de participação.' },
  ];

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
                <div className={styles.grid}>
                    {curriculum.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div 
                                key={item.title} 
                                className={styles.card}
                            >
                                <div className={styles.iconBox}>
                                    <Icon size={20} />
                                </div>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <p className={styles.cardText}>{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
