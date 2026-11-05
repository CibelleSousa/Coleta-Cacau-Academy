# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os manifestos primeiro: enquanto eles não mudarem, o Docker
# reaproveita a camada de node_modules em builds seguintes.
COPY package*.json ./

# npm ci respeita o package-lock.json — build reprodutível.
# Aqui instalamos tudo, inclusive devDependencies (Nest CLI, TypeScript).
RUN npm ci

COPY . .

# Gera dist/, incluindo dist/assets (ver "assets" em nest-cli.json)
RUN npm run build

# ==========================================
# Stage 2: Dependências de produção
# ==========================================
# Estágio separado só para ter um node_modules sem devDependencies.
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ==========================================
# Stage 3: Produção
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# node_modules enxuto do estágio deps; código compilado do estágio builder.
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# A imagem base já traz o usuário "node". Rodar como root dentro do container
# é risco desnecessário: se a aplicação for comprometida, o atacante começa
# com privilégio máximo.
USER node

# A aplicação escuta em 3001 (ver PORT em config/configuration.ts)
EXPOSE 3001

CMD ["npm", "run", "start:prod"]
