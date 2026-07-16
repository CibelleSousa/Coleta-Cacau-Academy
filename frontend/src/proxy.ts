import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware responsável por proteger rotas autenticadas na aplicação Next.js.
 * Verifica a existência do cookie `access_token` (JWT) e redireciona usuários não autenticados 
 * para a tela de login caso tentem acessar rotas protegidas.
 * 
 * @param {NextRequest} request - O objeto de requisição do Next.js contendo cookies e URL.
 * @returns {NextResponse} Resposta que permite a continuação da requisição ou redireciona para `/login`.
 * 
 * @example
 * // Se um usuário tentar acessar /app/dashboard sem o cookie, será redirecionado para /login
 */
export default function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/app/:path*'],
};