import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CourseModule } from '@/store/slices/coursesSlice';

/**
 * Interface representando os dados básicos do Usuário retornados pela API.
 */
export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
    streakCount: number;
    createdAt: string;
}

/**
 * Interface representando uma Questão individual dentro de um Quiz.
 */
export interface QuizQuestion {
    id: string;
    text: string;
    /** Opções de resposta disponíveis para a questão. */
    options: { id: string; text: string }[];
}

/**
 * Interface representando um Quiz completo associado a um módulo.
 */
export interface Quiz {
    id: string;
    title: string;
    description: string;
    /** Pontuação mínima necessária para aprovação (ex: 70). */
    passingScore: number;
    questions: QuizQuestion[];
}

/**
 * Interface representando o resultado da submissão de um Quiz pelo usuário.
 */
export interface QuizResult {
    /** Pontuação obtida em porcentagem. */
    score: number;
    /** Verdadeiro se a pontuação atingiu o `passingScore`. */
    passed: boolean;
    /** Número de questões acertadas. */
    correctCount: number;
    /** Total de questões do quiz. */
    totalQuestions: number;
}

/**
 * Interface representando um comentário feito em uma lição específica.
 */
export interface LessonComment {
    id: string;
    text: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        avatarUrl?: string;
    }
    /** Número total de curtidas no comentário. */
    likeCount: number;
    /** Indica se o usuário atual curtiu este comentário. */
    isLiked: boolean;
}

/**
 * Interface representando os detalhes completos de uma Lição.
 */
export interface LessonDetail {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    subtitle: string | null;
    description: string | null;
    videoUrl: string | null;
    duration: string;
    type: 'read' | 'video';
    order: number;
    done: boolean;
    rating?: number | null;
    module: {
        id: string;
        title: string;
    };
}

/**
 * API Slice central usando Redux Toolkit Query para a Coleta-Cacau Academy.
 * Gerencia todas as chamadas assíncronas à API NestJS, cache e invalidação de dados.
 */
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
        credentials: 'include',
    }),
    tagTypes: ['Modules', 'Lesson', 'Comments', 'Profile'],
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => 'users/me',
            providesTags: ['Profile'],
        }),
        updateMyProfile: builder.mutation<User, { name?: string, avatarUrl?: string }>({
            query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
            invalidatesTags: ['Profile'],
            async onQueryStarted(body, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        apiSlice.util.updateQueryData('getMe', undefined, (draft) => {
                            Object.assign(draft, data);
                        })
                    );
                } catch {}
            },
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({ url: '/auth/logout', method: 'GET' }),
        }),
        getModules: builder.query<CourseModule[], void>({
            query: () => '/courses/modules',
            providesTags: ['Modules'],
        }),
        completeLesson: builder.mutation<{ message: string, done: boolean }, { lessonId: string }>({
            query: (body) => ({ url: '/progress/lessons/complete', method: 'POST', body }),
            invalidatesTags: (result, error, arg) => [
                'Modules', 
                { type: 'Lesson', id: arg.lessonId }
            ],
        }),
        toggleLessonProgress: builder.mutation<{ lessonId: string, done: boolean }, { lessonId: string }>({
            query: ({ lessonId }) => ({ url: `/progress/${lessonId}/toggle`, method: 'POST' }),
            async onQueryStarted({ lessonId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getModules', undefined, (draft) => {
                        for (const module of draft) {
                            const lesson = module.lessons.find(l => l.id === lessonId);
                            if (lesson) {
                                lesson.done = !lesson.done;
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, arg) => [
                'Modules',
                { type: 'Lesson', id: arg.lessonId }
            ],
        }),
        rateLesson: builder.mutation<void, { lessonId: string, rating: number }>({
            query: (body) => ({ url: '/progress/lessons/rate', method: 'POST', body }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Lesson', id: arg.lessonId }
            ],
        }),
        getLessonComments: builder.query<LessonComment[], string>({
            query: (lessonId) => `/courses/lessons/${lessonId}/comments`,
            providesTags: (result, error, lessonId) => [{ type: 'Comments', id: lessonId }],
        }),
        addComment: builder.mutation<LessonComment, { lessonId: string, text: string }>({
            query: (body) => ({ url: `/courses/lessons/${body.lessonId}/comments`, method: 'POST', body: { text: body.text } }),
            invalidatesTags: (result, error, arg) => [{ type: 'Comments', id: arg.lessonId }],
        }),
        toggleLikeComment: builder.mutation<{ id: string, isLiked: boolean, likeCount: number }, { commentId: string, lessonId: string }>({
            query: ({ commentId }) => ({ url: `/courses/comments/${commentId}/like`, method: 'POST' }),
            async onQueryStarted({ commentId, lessonId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getLessonComments', lessonId, (draft) => {
                        const comment = draft.find(c => c.id === commentId);
                        if (comment) {
                            comment.isLiked = !comment.isLiked;
                            comment.likeCount += comment.isLiked ? 1 : -1;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),
        getQuiz: builder.query<Quiz, string>({
            query: (moduleId) => `/quizzes/${moduleId}`,
        }),
        submitQuiz: builder.mutation<QuizResult, { quizId: string, answers: { questionId: string, selectedOptionId: string }[] }>({
            query: (body) => ({ url: '/quizzes/submit', method: 'POST', body }),
        }),
        getLesson: builder.query<LessonDetail, string>({
            query: (id) => `/courses/lessons/${id}`,
            providesTags: (result, error, id) => [{ type: 'Lesson', id }]
        }),
    }),
});

export const { 
    useGetMeQuery, 
    useUpdateMyProfileMutation,
    useLogoutMutation, 
    useGetModulesQuery,
    useCompleteLessonMutation,
    useToggleLessonProgressMutation,
    useRateLessonMutation,
    useGetLessonCommentsQuery,
    useAddCommentMutation,
    useToggleLikeCommentMutation,
    useGetQuizQuery,
    useSubmitQuizMutation,
    useGetLessonQuery
} = apiSlice;
