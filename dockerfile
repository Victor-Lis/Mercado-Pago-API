# ==============================================================================
# Estágio Base: Contém Node.js e pnpm
# ==============================================================================
FROM node:22-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# ==============================================================================
# Estágio Deps: Instala todas as dependências para aproveitar o cache
# ==============================================================================
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# ==============================================================================
# Estágio Builder: Constrói a aplicação para produção
# ==============================================================================
FROM deps AS builder
# Copia o resto do código fonte
COPY . .
RUN pnpm build

# ==============================================================================
# Estágio de Produção (Runner)
# ==============================================================================
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# Cria um usuário e grupo não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia apenas os ficheiros de manifesto e instala SOMENTE as dependências de produção
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod

# Copia os artefactos de build
COPY --from=builder /app/dist ./dist

# Muda para o usuário não-root
USER appuser

EXPOSE 3030
CMD ["pnpm", "start"]

# ==============================================================================
# Estágio de Desenvolvimento
# ==============================================================================
FROM deps AS dev
# Copia o resto do código (será sobreposto pelo volume)
COPY . .
EXPOSE 3030
# O comando será fornecido pelo docker-compose
CMD ["pnpm", "dev"]