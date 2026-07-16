import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface que define a estrutura do estado do usuário autenticado na Store.
 */
export interface UserState {
    /** Identificador único do usuário (UUID) ou null se não estiver logado. */
    id: string | null;
    /** Nome completo do usuário. */
    name: string | null;
    /** Endereço de e-mail do usuário. */
    email: string | null;
    /** URL do avatar/foto de perfil do usuário. */
    avatarUrl: string | null;
    /** Papel do usuário no sistema (ex: 'student', 'admin'). */
    role: string | null;
    /** Contagem de dias consecutivos de acesso (streak). */
    streakCount: number | null;
    /** Data de criação da conta do usuário no formato ISO. */
    createdAt: string | null;
}

/**
 * O estado inicial do reducer de autenticação, padrão nulo para todos os campos.
 */
const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    avatarUrl: null,
    role: null,
    streakCount: null,
    createdAt: null,
};

/**
 * Slice do Redux Toolkit responsável pelo gerenciamento do estado de autenticação.
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Action para definir/atualizar os dados do usuário logado.
         * 
         * @param {UserState} state - O estado atual.
         * @param {PayloadAction<UserState>} action - A action contendo os dados do usuário.
         */
        setUser: (state, action: PayloadAction<UserState>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.avatarUrl = action.payload.avatarUrl;
            state.role = action.payload.role;
            state.streakCount = action.payload.streakCount;
            state.createdAt = action.payload.createdAt;
        },
        /**
         * Action responsável por limpar os dados do usuário, realizando o logout local.
         * 
         * @param {UserState} state - O estado atual.
         */
        logout: (state) => {
            state.id = null;
            state.name = null;
            state.email = null;
            state.avatarUrl = null;
            state.role = null;
            state.streakCount = null;
            state.createdAt = null;
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;