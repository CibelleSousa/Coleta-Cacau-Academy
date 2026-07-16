'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useGetQuizQuery, useSubmitQuizMutation, QuizResult } from '@/services/api';
import { toast } from 'react-hot-toast';
import PageLoader from '@/components/ui/PageLoader';
import { ErrorFound, NotFound } from '@/components/ui/PageError';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './page.module.css';

export default function QuizPage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = use(params);
    const { data: quiz, isLoading, isError } = useGetQuizQuery(moduleId);
    const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
    
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [resultData, setResultData] = useState<QuizResult | null>(null);

    useEffect(() => {
        if (isError) {
            toast.error('Erro ao carregar o questionário. Tente novamente.');
        }
    }, [isError]);

    const handleSelectAnswer = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        if (!quiz) return;

        const allAnswered = quiz.questions.length === Object.keys(answers).length;

        if (!allAnswered) {
            toast.error('Responda todas as questões antes de enviar.');
            return;
        }

        const formattedAnswers = Object.keys(answers).map(qId => ({
            questionId: qId,
            selectedOptionId: answers[qId]
        }));

        submitQuiz({ quizId: quiz.id, answers: formattedAnswers })
            .unwrap()
            .then((res) => {
                toast.success('Quiz submetido com sucesso!');
                setResultData(res);
            })
            .catch((err) => {
                toast.error('Erro ao submeter o quiz.');
            });
    };

    if (isLoading) {
        return (
            <PageLoader />
        );
    }

    if (isError) {
        return(
            <div className={styles.container}>
                <ErrorFound message='Erro ao carregar o questionário. Tente novamente.' />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className={styles.container}>
                <NotFound message='Nenhum questionário encontrado para este módulo.' />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link href="/app/conteudos" className={styles.backLink}>
                <ChevronLeft size={16} /> Voltar para o curso
            </Link>

            <div className={styles.header}>
                <h1 className={styles.title}>{quiz.title}</h1>
                <p className={styles.description}>{quiz.description}</p>
            </div>

            {resultData ? (
                <div className={styles.resultCard}>
                    {resultData.passed ? (
                        <CheckCircle2 size={48} className={styles.resultIconSuccess} />
                    ) : (
                        <XCircle size={48} className={styles.resultIconFail} />
                    )}
                    <h2 className={styles.resultTitle}>
                        {resultData.passed ? 'Parabéns, você passou!' : 'Não foi dessa vez'}
                    </h2>
                    <p className={styles.resultText}>
                        Você acertou {resultData.correctCount} de {resultData.totalQuestions} questões.
                    </p>
                    <p className={styles.resultScore}>Pontuação: {resultData.score}%</p>
                    <Link href="/app" className={styles.submitBtn}>
                        Voltar para o Dashboard
                    </Link>
                </div>
            ) : (
                <div className={styles.quizList}>
                    {quiz.questions.map((question, qIndex) => (
                        <div key={question.id} className={styles.questionCard}>
                            <h3 className={styles.questionText}>
                                {qIndex + 1}. 
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]} 
                                    components={{ p: 'span' }}
                                >
                                    {question.text}
                                </ReactMarkdown>
                            </h3>
                            <div className={styles.optionsList}>
                                {question.options.map((option) => (
                                    <label 
                                        key={option.id} 
                                        className={`${styles.optionLabel} ${answers[question.id] === option.id ? styles.optionSelected : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={option.id}
                                            checked={answers[question.id] === option.id}
                                            onChange={() => handleSelectAnswer(question.id, option.id)}
                                            className={styles.radioInput}
                                        />
                                        <div className={styles.optionTextContainer}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {option.text}
                                            </ReactMarkdown>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || Object.keys(answers).length !== quiz.questions.length}
                        className={styles.submitBtn}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Respostas'}
                    </button>
                </div>
            )}
        </div>
    );
}