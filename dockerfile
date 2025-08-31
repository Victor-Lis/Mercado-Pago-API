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
# Define um argumento que pode ser passado durante o build (pelo docker-compose)
ARG PORT=3000
# Define as variáveis de ambiente para o container em execução
ENV NODE_ENV=production
ENV PORT=${PORT}
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

# Expõe a porta definida pela variável de ambiente
EXPOSE ${PORT}
CMD ["pnpm", "start"]