# Étape 1 : build de l'app
FROM oven/bun:1 AS builder

WORKDIR /app

# Ensure OpenSSL is available for Prisma (detects and links engines correctly)
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copie uniquement les fichiers nécessaires à l'installation
COPY package.json bun.lock ./

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

# OpenSSL also required at runtime for Prisma engines
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copie uniquement le build et les node_modules depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

# Apply pending Prisma migrations on startup, then launch Next.js
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
