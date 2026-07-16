'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';
import { useGetModulesQuery, useCompleteLessonMutation, useGetLessonQuery, LessonDetail } from '@/services/api';
import { CourseModule } from '@/store/slices/coursesSlice';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PageLoader from '@/components/ui/PageLoader';
import styles from './page.module.css';

export default function LicaoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { data: modules = [] } = useGetModulesQuery();
    const { data: lessonData, isLoading } = useGetLessonQuery(id);
    const [completeLesson, { isLoading: isCompleting }] = useCompleteLessonMutation();

    // Get flat list of theory lessons for Prev/Next navigation
    const currentModule = useMemo(() => {
        return modules.find((m: CourseModule) => m.lessons.some(l => l.id === id));
    }, [modules, id]);

    const currentModuleLessons = useMemo(() => {
        return currentModule?.lessons || [];
    }, [currentModule]);

    const currentIndex = currentModuleLessons.findIndex(l => l.id === id);
    const prev = currentIndex > 0 ? currentModuleLessons[currentIndex - 1] : null;
    const next = currentIndex < currentModuleLessons.length - 1 ? currentModuleLessons[currentIndex + 1] : null;

    const handleComplete = async () => {
        try {
            await completeLesson({ lessonId: id }).unwrap();
            toast.success('Módulo concluído! Parabéns.');
            router.push('/app/conteudos');
        } catch (error) {
            toast.error('Erro ao concluir aula.');
        }
    }

    const handleNext = async () => {
        if ( lessonData && !lessonData.done ) {
            try {
                await completeLesson({ lessonId: id }).unwrap();
                toast.success('Aula concluída!');
            } catch (error) {
                console.error('Erro ao salvar progresso: ', error );
                toast.error('Erro ao salvar progresso. ');
                return;
            }
        }
        if (next) {
            router.push(`/app/licao/${next.id}`);
        }
    }

    if (isLoading || !lessonData) {
        return (
            <div className={styles.pageContainer}>
                <PageLoader message="Carregando lição..." />
            </div>
        );
    }

    const lesson: LessonDetail = lessonData;

    return (
        <div className={styles.pageContainer}>
            <Link href="/app/conteudos" className={styles.backLink}>
                <ChevronLeft size={14} /> Voltar para conteúdos
            </Link>

            <div className={styles.metaRow}>
                <BookOpen size={14} />
                <span>{lessonData.module?.title}</span>
                <span>·</span>
                <span>{lessonData.duration} de leitura</span>
            </div>
            <h1 className={styles.lessonTitle}>{lessonData.title}</h1>

            <article className={styles.article}>
                <div className={styles.markdownBody}>
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({node, inline, className, children, ...props}: any) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {lessonData.content || ''}
                    </ReactMarkdown>
                </div>
            </article>

            <div className={styles.footerNav}>
                {prev ? (
                    <Link href={`/app/licao/${prev.id}`} className={styles.navCard}>
                        <p className={styles.navLabel}>
                            <ChevronLeft size={12} /> Aula anterior
                        </p>
                        <p className={styles.navTitle}>{prev.title}</p>
                    </Link>
                ) : (
                    <div />
                )}
                
                {next ? (
                    <button
                        onClick={handleNext}
                        disabled={isCompleting}
                        className={`${styles.navCard} ${styles.navCardRight}`}
                    >
                        <p className={styles.navLabel}>
                            {isCompleting? 'Salvando...' : 'Próxima aula'} <ChevronRight size={12} /> 
                        </p>
                        <p className={styles.navTitle}>{next.title}</p>
                    </button>
                    ) : (
                    <button 
                        onClick={handleComplete}
                        disabled={isCompleting}
                        className={styles.concluirBtn}
                    >
                        <CheckCircle2 size={16} /> {isCompleting ? 'Salvando...' : 'Concluir módulo'}
                    </button>
                )}
            </div>
        </div>
    );
}
