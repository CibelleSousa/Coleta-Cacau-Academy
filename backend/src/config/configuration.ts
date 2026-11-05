export default () => ({
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    frontendUrl: process.env.FRONTEND_URL,
    cookie: {
        /**
         * Domínio do cookie de sessão.
         *
         * Em localhost fica vazio: o cookie é host-only e frontend e backend
         * compartilham o host "localhost" (a porta não entra na conta), então
         * ambos o enxergam.
         *
         * Em produção com frontend em `exemplo.com` e backend em
         * `api.exemplo.com`, um cookie host-only pertenceria apenas a
         * `api.exemplo.com`, e o middleware do Next (frontend/src/proxy.ts)
         * nunca o veria — a proteção de rotas pararia de funcionar.
         * Defina COOKIE_DOMAIN=.exemplo.com para que valha nos dois.
         */
        domain: process.env.COOKIE_DOMAIN || undefined,
        /**
         * 'lax' basta quando frontend e backend estão no mesmo site
         * registrável (exemplo.com e api.exemplo.com são o mesmo site).
         *
         * Em domínios distintos o navegador trata as chamadas como
         * cross-site e não envia o cookie com 'lax'; aí é obrigatório
         * SameSite=None, que por sua vez exige Secure (HTTPS).
         */
        sameSite: (process.env.COOKIE_SAMESITE || 'lax') as 'lax' | 'strict' | 'none',
    },
});
