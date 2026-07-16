# Frontend - Coleta-Cacau Academy

Este diretório contém o código-fonte do frontend da plataforma **Coleta-Cacau Academy**, construído para oferecer uma experiência de usuário fluida e responsiva para os estudantes.

## 📚 Tech Stack

A aplicação é construída com as seguintes tecnologias de ponta:

- **[Next.js 16](https://nextjs.org/)**: Utilizando a arquitetura **App Router** (`app/` directory) para roteamento baseado em arquivos e renderização no servidor.
- **[React 19](https://react.dev/)**: Com o **React Compiler** habilitado nativamente via `next.config.ts` (`reactCompiler: true`) para otimização automática de re-renderizações.
- **Turbopack**: Bundler de alta velocidade padrão do Next.js para ambiente de desenvolvimento.
- **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)**: Solução poderosa para fetching e cache de dados, integrada ao Redux Toolkit.
- **CSS Modules**: Estilização encapsulada focada em componentes, evitando vazamento de estilos globais.

## 🗂️ Estrutura do Projeto

O projeto segue a convenção moderna do Next.js, separando responsabilidades de forma clara:

```text
frontend/
├── src/                 # Código fonte do frontend
│   ├── app/             # Rotas da aplicação (App Router)
│   │   ├── (auth)/      # Rotas de autenticação (login, registro)
│   │   └── (dashboard)/ # Rotas protegidas (dashboard, aulas, perfil, etc)
│   ├── components/      # Componentes de UI reutilizáveis (botões, skeletons, etc)
│   ├── hooks/           # Hooks costumizados da aplicação
│   ├── services/        # Definição do apiSlice (RTK Query) e endpoints da API
│   ├── store/           # Configuração da Store Redux e Slices locais (ex: authSlice)
│   └── utils/           # Funções utilitárias da aplicação
├── docs/                # Documentação do código fonte do frontend
└── public/              # Assets estáticos
```

## 🧠 Gerenciamento de Estado e Dados

Nós utilizamos o **RTK Query** como camada principal de comunicação com o backend NestJS. 

### Regras de Ouro:
1. **Proibido `useEffect` para fetching**: Nunca utilize `useEffect` combinado com `useState` para buscar dados da API. O RTK Query lida com cache, loading states, e deduplicação de requisições automaticamente. Use os hooks gerados (ex: `useGetModulesQuery`, `useGetLessonQuery`).
2. **Invalidação de Cache via Tags**: Sempre que uma mutação ocorrer (ex: marcar aula como concluída, adicionar comentário), utilize o array `invalidatesTags` no endpoint de mutação para forçar a atualização automática das queries dependentes (ex: `['Modules', 'Lesson']`). Para updates otimistas, use o padrão `onQueryStarted` para atualizar o cache local instantaneamente.

## 🎨 Padrões de UI/UX

Para garantir uma experiência consistente e livre de "piscadas" de conteúdo, a aplicação segue regras rígidas para estados de carregamento (loading states):

- **Skeletons para Listas e Dashboards**: Ao carregar grids, listas de módulos ou feeds de comentários, renderize componentes `Skeleton` (blocos cinzas animados) que preservem a estrutura visual da página. Isso impede o "layout shift" (CLS) enquanto os dados são baixados.
- **PageLoaders para Conteúdo Dinâmico Isolado**: Ao navecar para visualizações dinâmicas individuais (ex: a página de um vídeo específico, um formulário longo ou a emissão de um certificado em PDF), utilize um `PageLoader` centralizado (spinner) na tela. Como não há uma estrutura de grid previsível antes do carregamento do conteúdo específico, um loader de página inteira evita que elementos "saltem" na tela.

## 🚀 Rodando Localmente

Para iniciar o ambiente de desenvolvimento, siga os passos abaixo.

### 1. Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz da pasta `frontend/` com a URL da sua API:

```env
# URL do seu backend NestJS
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Instalação e Execução
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado (recomendado versão 20+).

```bash
# Instala as dependências do projeto
npm install

# Inicia o servidor de desenvolvimento (com Turbopack)
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### Outros comandos úteis

```bash
# Gera a build de produção
npm run build

# Inicia o servidor em modo de produção (após o build)
npm start

# Verifica erros de lint no código
npm run lint
```