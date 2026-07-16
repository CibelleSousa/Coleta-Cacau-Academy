'use client';

import Link from 'next/link';
import { useState, use, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Play, Heart, MessageSquare, Star, CheckCircle2 } from 'lucide-react';
import { 
    useGetModulesQuery, 
    useToggleLessonProgressMutation, 
    useGetLessonQuery, 
    useGetLessonCommentsQuery, 
    useAddCommentMutation,
    useToggleLikeCommentMutation,
    useRateLessonMutation,
    LessonDetail 
} from '@/services/api';
import { CourseModule } from '@/store/slices/coursesSlice';
import toast from 'react-hot-toast';
import Avatar from '@/components/ui/Avatar';
import PageLoader from '@/components/ui/PageLoader';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';

export default function AulaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { data: modules = [] } = useGetModulesQuery();
    const { data: lessonData, isLoading } = useGetLessonQuery(id);
    const { data: comments = [], isLoading: isLoadingComments } = useGetLessonCommentsQuery(id);

    const [toggleLessonProgress, { isLoading: isToggling }] = useToggleLessonProgressMutation();
    const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
    const [rateLesson] = useRateLessonMutation();
    const [toggleLikeComment, { isLoading: isLiking }] = useToggleLikeCommentMutation();

    const [rating, setRating] = useState(lessonData?.rating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (lessonData) {
            setRating(lessonData.rating || 0);
        }
    }, [lessonData]);

    const practicalLessons = useMemo(() => {
        return modules.filter((m: CourseModule) => m.type === 'PRACTICAL').flatMap(m => m.lessons);
    }, [modules]);

    const currentModule = modules.find((m: CourseModule) => m.lessons.some(l => l.id === id)) || modules.find((m: CourseModule) => m.type === 'PRACTICAL');
    const currentLesson = currentModule?.lessons.find(l => l.id === id);

    const currentIndex = practicalLessons.findIndex(l => l.id === id);
    const nextLesson = currentIndex < practicalLessons.length - 1 ? practicalLessons[currentIndex + 1] : null;

    const handleToggleComplete = async () => {
        try {
            const res = await toggleLessonProgress({ lessonId: id }).unwrap();
            if (res.done) {
                toast.success('Aula concluída!');
                if (!nextLesson) {
                    router.push('/app/pratico');
                }
            } else {
                toast.success('Aula desmarcada.');
            }
        } catch (error) {
            toast.error('Erro ao atualizar progresso.');
        }
    };

    const handleRating = async (ratingValue: number) => {
        setRating(ratingValue);
        try {
            await rateLesson({ lessonId: id, rating: ratingValue }).unwrap();
            toast.success('Avaliação enviada!');
        } catch (error) {
            toast.error('Erro ao salvar avaliação.');
            setRating(lessonData?.rating || 0); // Reverte em caso de erro
        }
    }

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        try {
            await addComment({ lessonId: id, text: comment }).unwrap();
            setComment('');
            toast.success('Comentário publicado!');
        } catch (error) {
            toast.error('Erro ao publicar comentário.');
        }
    }

    if (isLoading || !lessonData || !currentModule || !currentLesson) {
        return (
            <div className={styles.pageContainer}>
                <PageLoader message="Carregando vídeo..." />
            </div>
        );
    }

    //Função utilitária para converter URL curta do YouTube para URL de Embed
    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return '';
        const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]v=([^&]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };

    const embedUrl = getYouTubeEmbedUrl(lessonData.videoUrl!);
    const isLessonDone = lessonData.done;

    return (
        <div className={styles.pageContainer}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs}>
                <Link href="/app/pratico">Projeto Prático</Link>
                <ChevronRight size={12} />
                <span>{currentModule.title}</span>
                <ChevronRight size={12} />
                <span className={styles.breadcrumbActive}>{currentLesson.title}</span>
            </nav>

            <div className={styles.mainGrid}>
                {/* Main Content */}
                <div className={styles.leftColumn}>
                    {/* Video Player */}
                    <div className={styles.videoWrapper}>
                        {embedUrl ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title={lessonData.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, border: 'none' }}
                            ></iframe>
                        ) : (
                            <div className={styles.videoPlaceholder}>
                                <p style={{ color: 'var(--muted-foreground)' }}>Vídeo não disponível</p>
                            </div>
                        )}
                    </div>

                    {/* Title Row */}
                    <div className={styles.titleRow}>
                        <div>
                            <h1 className={styles.lessonTitle}>{currentLesson.title}</h1>
                            {lessonData.subtitle && (
                                <p className={styles.lessonSubtitle}>{lessonData.subtitle}</p>
                            )}
                        </div>
                        <div className={styles.buttonRow}>
                            <button
                                onClick={handleToggleComplete}
                                disabled={isToggling}
                                className={`${styles.completeBtn} ${isLessonDone ? styles.completeBtnDone : ''}`}
                            >
                                <CheckCircle2 size={16} /> 
                                {isToggling ? 'Salvando...' : isLessonDone ? 'Aula Concluída' : 'Concluir Aula'}
                            </button>
                            <Link 
                                href={nextLesson ? `/app/aula/${nextLesson.id}` : '/app/pratico'} 
                                className={styles.nextBtn}
                            >
                                {nextLesson ? 'Próxima aula' : 'Finalizar'} <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className={styles.card}>
                        <p className={styles.cardText} style={{ whiteSpace: 'pre-wrap' }}>{lessonData.description}</p>
                    </div>

                    {/* Rating Card */}
                    <div className={styles.card}>
                        <p className={styles.cardText} style={{ fontWeight: 600 }}>Como você avalia este conteúdo?</p>
                        <div className={styles.ratingRow}>
                            {Array.from({ length: 5 }).map((_, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <button
                                        key={i}
                                        className={styles.starButton}
                                        onClick={() => handleRating(ratingValue)}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                        aria-label={`Rate ${ratingValue} stars`}
                                    >
                                        <Star 
                                            size={24} 
                                            className={ratingValue <= (hover || rating) ? styles.starActive : styles.starInactive} 
                                        />
                                    </button>
                                );
                            })}
                            <span className={styles.ratingText}>
                                {(hover || rating) > 0 ? `Você deu ${hover || rating} de 5` : 'Toque nas estrelas'}
                            </span>
                        </div>
                    </div>

                    {/* Comments Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
                            <p className={styles.cardText} style={{ fontWeight: 600 }}>Comentários ({comments.length})</p>
                        </div>

                        <div className={styles.commentInputRow}>
                            <div className={styles.inputWrapper}>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Escreva um comentário…"
                                    className={styles.textarea}
                                    rows={2}
                                />
                                <div className={styles.publishRow}>
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!comment.trim() || isAddingComment}
                                        className={styles.publishBtn}
                                    >
                                        {isAddingComment ? 'Publicando...' : 'Publicar'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ul className={styles.commentList}>
                            {isLoadingComments ? (
                                <>
                                    {[1, 2, 3].map(i => (
                                        <li key={i} className={styles.commentItem}>
                                            <Skeleton className={styles.commentAvatar} />
                                            <div className={styles.commentContent}>
                                                <Skeleton style={{ width: '120px', height: '14px', marginBottom: '0.5rem' }} />
                                                <Skeleton style={{ width: '100%', height: '14px', marginBottom: '0.25rem' }} />
                                                <Skeleton style={{ width: '60%', height: '14px' }} />
                                            </div>
                                        </li>
                                    ))}
                                </>
                            ) : comments.length === 0 ? (
                                <li style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Seja o primeiro a comentar!</li>
                            ) : (
                                comments.map((c) => (
                                    <li key={c.id} className={styles.commentItem}>
                                        <div className={styles.commentAvatar}>
                                            <Avatar src={c.user.avatarUrl} name={c.user.name} className={styles.avatar} />
                                        </div>
                                        <div className={styles.commentContent}>
                                            <p className={styles.commentMeta}>
                                                <span className={styles.commentAuthor}>{c.user.name}</span> <span className={styles.commentTime}>· {new Date(c.createdAt).toLocaleDateString()}</span>
                                            </p>
                                            <p className={styles.commentText}>{c.text}</p>
                                            <button 
                                                className={styles.likeBtn} 
                                                onClick={() => toggleLikeComment({ commentId: c.id, lessonId: id })}
                                                disabled={isLiking}
                                            >
                                                <Heart 
                                                    size={12} 
                                                    fill={c.isLiked ? "currentColor" : "none"} 
                                                    color={c.isLiked ? "var(--primary)" : "currentColor"}
                                                /> 
                                                {c.likeCount} Curtir
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* Playlist Sidebar */}
                <aside className={styles.playlistSidebar}>
                    <div className={styles.playlistHeader}>
                        <p className={styles.playlistLabel}>Playlist</p>
                        <p className={styles.playlistTitle}>{currentModule.title}</p>
                    </div>
                    <ul className={styles.playlistList}>
                        {currentModule.lessons.map((l) => {
                            const active = l.id === id;
                            return (
                                <li key={l.id}>
                                    <Link href={`/app/aula/${l.id}`} className={`${styles.playlistLink} ${active ? styles.playlistLinkActive : styles.playlistLinkInactive}`}>
                                        <div className={`${styles.playlistIconBox} ${active ? styles.iconBoxActive : l.done ? styles.iconBoxDone : styles.iconBoxDefault}`}>
                                            {l.done && !active ? <CheckCircle2 size={16} /> : <Play size={16} />}
                                        </div>
                                        <div>
                                            <p className={`${styles.playlistLessonTitle} ${active ? styles.playlistLessonTitleActive : ''}`}>{l.title}</p>
                                            <p className={styles.playlistLessonTime}>{l.duration}</p>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </aside>
            </div>
        </div>
    );
}
