# Étape 1 : build de l'app
FROM oven/bun:1 AS builder

WORKDIR /app

# Copie uniquement les fichiers nécessaires à l'installation
COPY package.json bun.lock ./

# ⚡ Ajout d'OpenSSL et des certificats CA
RUN apt-get update -y \
  && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Installe TOUTES les dépendances (y compris dev)
RUN bun install

# Copie le reste du code source
COPY . .

# Prisma generate
RUN bunx prisma generate

# Build Next.js
RUN bun run build

# Étape 2 : image finale allégée
FROM oven/bun:1 AS runner

WORKDIR /app

# Copie uniquement le build et les node_modules depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY .env .env

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "start"]
