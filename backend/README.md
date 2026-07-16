# Backend - Coleta-Cacau Academy

Este diretório contém a API REST da plataforma **Coleta-Cacau Academy**, responsável por gerenciar autenticação, cursos, progresso, quizzes e emissão de certificados.

## 🛠️ Tech Stack

A arquitetura do backend é construída sobre as seguintes tecnologias:

- **[NestJS 11](https://nestjs.com/)**: Framework progressivo para Node.js, construído com TypeScript.
- **[TypeORM](https://typeorm.io/)**: ORM utilizado para mapeamento objeto-relacional e manipulação do banco de dados.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional robusto, executado via container Docker local.
- **Recursos integrados**: `@nestjs/passport` (OAuth e JWT), `@nestjs/throttler` (Rate Limiting), `@nestjs/event-emitter` (Eventos assíncronos), e `helmet` (Segurança HTTP).

## 🔐 Fluxo de Autenticação

A autenticação utiliza o fluxo **Google OAuth 2.0** combinado com a emissão de um **JWT em um cookie `HttpOnly`**.

1. **Início do Fluxo**: O usuário clica em "Entrar com Google" no frontend e é redirecionado para a rota `/auth/google`.
2. **Callback do Google**: Após a autorização do usuário, o Google redireciona de volta para `/auth/google/callback`. A `GoogleStrategy` do Passport valida o perfil e chama o `AuthService`, que cria ou atualiza o registro do usuário no banco de dados (calculando a *streak* de acesso diário).
3. **Geração do JWT**: O `AuthService` assina um token JWT contendo o `id`, `email` e `role` do usuário.
4. **Cookie HttpOnly**: O token JWT não é retornado no corpo da requisição JSON. Em vez disso, ele é injetado em um cookie chamado `access_token`, configurado como `httpOnly: true` (para impedir acesso via JavaScript e proteger contra XSS), com validade de 1 dia.
5. **Consumo**: O navegador envia automaticamente o cookie em todas as requisições subsequentes. O `JwtStrategy` utiliza um extrator customizado para ler o token diretamente do cookie, autenticando o usuário sem a necessidade de cabeçalhos `Authorization` manuais no frontend.

## 🗄️ Configuração do Banco de Dados

Utilizamos o **TypeORM** em conjunto com o **PostgreSQL**.

### Sincronização de Entidades
Em ambiente de desenvolvimento (`NODE_ENV=development`), o TypeORM está configurado com a opção `synchronize: true`. Isso significa que **você não precisa rodar migrations manualmente durante o desenvolvimento**. Basta criar ou alterar suas classes de Entidade (decoradas com `@Entity()`) na pasta `database/entities/`, e o TypeORM atualizará o schema do banco de dados automaticamente ao iniciar o servidor.

> ⚠️ **Atenção:** A opção `synchronize: true` **nunca** deve ser habilitada em produção, pois pode causar perda de dados.

### Conexão com o Container Postgres Local
Certifique-se de ter o Docker instalado e rode um container do PostgreSQL localmente. Você pode subir um banco rapidamente com o comando:

```bash
docker run --name cacau-postgres -e POSTGRES_USER=seu_usuario -e POSTGRES_PASSWORD=sua_senha -e POSTGRES_DB=cacau_academy -p 5432:5432 -d postgres:15
```

Certifique-se de que as variáveis de ambiente no seu arquivo `.env` correspondam às credenciais configuradas no container acima.

## 📖 Documentação da API (Swagger)

A API é totalmente documentada utilizando o `@nestjs/swagger`. Todas as rotas, DTOs e parâmetros de resposta são mapeados via decoradores nas controllers.

Durante o modo de desenvolvimento, a interface visual do Swagger UI fica disponível em:
👉 **[http://localhost:3001/api/docs](http://localhost:3001/api/docs)**

Você pode usar o botão "Authorize" (cadeado) no painel do Swagger para testar rotas protegidas.

## 🚀 Rodando Localmente

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz da pasta `backend/` com as seguintes variáveis:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_user_name_change_this
DB_PASSWORD=your_user_password_change_this
DB_NAME=cacau_academy

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_change_this
GOOGLE_CLIENT_SECRET=your_google_client_secret_change_this
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# JWT
JWT_SECRET=your_secret_jwt_key_change_this
JWT_EXPIRES_IN=1d

# Frontend URL (Strict CORS)
FRONTEND_URL=http://localhost:3000
```

### 2. Instalação e Execução
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

```bash
# Instala as dependências do projeto
npm install

# Inicia o servidor em modo de desenvolvimento (com watch mode)
npm run start:dev
```

A API estará disponível em `http://localhost:3001`.

### Comandos Adicionais Úteis

```bash
# Popula o banco de dados com dados iniciais (Usuários, Módulos, Lições, etc.)
npm run seed

# Gera o build de produção
npm run build

# Inicia o servidor em modo de produção (requer build prévio)
npm run start:prod

# Roda a suíte de testes do supertest
npm run test:e2e
```