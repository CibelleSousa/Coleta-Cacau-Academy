import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/coursesSlice';
import { apiSlice } from '@/services/api';

/**
 * A Store central do Redux Toolkit para a aplicação Coleta-Cacau Academy.
 * Combina os reducers de autenticação, cursos e a API Slice (RTK Query).
 */
export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: coursesReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

/**
 * Tipo raiz que representa a árvore de estado completa da aplicação Redux.
 * Derivado automaticamente a partir da configuração da `store`.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Tipo da função `dispatch` do Redux configurada para a aplicação.
 * Garante a tipagem correta para despachar actions e thunks.
 */
export type AppDispatch = typeof store.dispatch;