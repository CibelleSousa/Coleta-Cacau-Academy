<div align="center">
  <h1>🍫 Coleta-Cacau Academy</h1>
  <p>Aprenda a construir aplicativos reais em React Native enquanto constrói o seu próprio.</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
  ![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)
  ![Docker](https://img.shields.io/badge/Docker-3.8-2496ED?logo=docker)
</div>

---

## 📖 Sobre o Projeto

A **Coleta-Cacau Academy** é uma plataforma educacional gratuita criada com um propósito duplo: ensinar desenvolvimento mobile com React Native e servir como um case real de engenharia de software para estudantes universitários. 

Acreditamos que a melhor forma de aprender uma tecnologia é construindo algo real. Por isso, a plataforma oferece uma trilha completa de ensino, onde o aluno acompanha videoaulas, lê conteúdos teóricos, testa seus conhecimentos em quizzes interativos e, ao final, recebe um certificado oficial de conclusão.

## ✨ Funcionalidades Principais

- 🌓 **Tema Light/Dark**: Interface adaptável com persistência de tema no dispositivo do usuário para conforto visual em qualquer ambiente.
- 📈 **Rastreamento de Progresso**: Sistema de "streak" (dias consecutivos de acesso) e marcação de aulas concluídas, com invalidação de cache otimista para feedback instantâneo na UI.
- 🧠 **Sistema de Quizzes**: Avaliações interativas por módulo. As respostas corretas são validadas estritamente no backend para evitar fraudes, com pontuação dinâmica e nota de corte.
- 🎓 **Certificados em PDF**: Emissão dinâmica e automática de certificados oficiais em PDF (gerados via `pdfkit`) assim que o aluno conclui todas as aulas e aprova em todos os quizzes.

## 🏗️ Visão Geral da Arquitetura

O projeto adota uma estrutura de **Monorepo**, mantendo o Frontend e o Backend no mesmo repositório para facilitar o compartilhamento de tipos e o versionamento unificado.

- **Frontend (`/frontend`)**: Aplicação web Next.js (App Router) construída com React 19, RTK Query para gerenciamento de dados e CSS Modules. 
  👉 *Veja detalhes de instalação e padrões de UI em: [Frontend README](./frontend/README.md)*
- **Backend (`/backend`)**: API REST em NestJS, arquitetura modular, TypeORM para persistência e arquitetura orientada a eventos (`EventEmitter`) para emissão de certificados.
  👉 *Veja detalhes de autenticação, banco de dados e seeds em: [Backend README](./backend/README.md)*

## 🐳 Rodando o Projeto (Docker)

A infraestrutura de banco de dados (PostgreSQL) e a API (NestJS) são orquestradas via Docker para um setup sem fricções.

### 1. Configuração do Ambiente
Na raiz do projeto, crie um arquivo `.env` com as variáveis necessárias. Use o exemplo abaixo:

```env
# Variáveis do Banco de Dados (Compartilhadas entre o Docker e o NestJS)
POSTGRES_USER=seu_usuario_do_banco
POSTGRES_PASSWORD=sua_senha_super_secreta
POSTGRES_DB=coleta_cacau_db

# Variáveis do Google OAuth e JWT do backend

# Gere uma string aleatória e segura para assinar seus cookies
JWT_SECRET=sua_chave_jwt_super_secreta

# Credenciais do Google Cloud Console (OAuth 2.0)
GOOGLE_CLIENT_ID=seu_client_id_do_google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret_do_google
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# URL onde o frontend está rodando
FRONTEND_URL=http://localhost:3000
```

Na dúvida, há um arquivo `.env.example` na raiz deste diretório. Basta substituir os valores pelos valores reais e renomear o arquivo para `.env`.

### 2. Iniciando os Contêineres
Com o Docker e Docker Compose instalados, basta rodar:

```bash
# Sobe o banco de dados e o backend em modo detached
docker compose up -d
```

Isso deixará o Backend rodando em `http://localhost:3001` e o PostgreSQL na porta `5432`.

> **Nota**: Para rodar o Frontend (Next.js), acesse a pasta `/frontend`, instale as dependências (`npm install`) e rode `npm run dev` localmente, apontando a variável de ambiente `NEXT_PUBLIC_API_URL` para o backend containerizado.

---

<div align="center">
  <sub>Construído com 💚 para a comunidade acadêmica.</sub>
</div>