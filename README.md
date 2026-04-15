This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

globbing
cypress
e2e

## Docker

Voici deux façons de lancer l'application avec Docker.

- Option A — Docker Compose (recommandé):
  1) Dupliquez votre fichier d'environnement: `cp .env.exemple .env` et renseignez au minimum `JWT_SECRET`.
  2) Lancez: `docker compose up --build`.
  3) L'application est disponible sur http://localhost:3000.

  Notes:
  - La base Postgres tourne dans le service `db`. La variable `DATABASE_URL` est sur `postgresql://postgres:postgres@db:5432/social?schema=public` via `docker-compose.yml`.
  - Les migrations Prisma sont appliquées automatiquement au démarrage du conteneur applicatif.

- Option B — Image seule (DB externe):
  1) Construisez: `docker build -t social-network .`
  2) Lancez en pointant vers votre base: `docker run --env-file .env -e DATABASE_URL="postgresql://USER:PASS@HOST:5432/DB?schema=public" -p 3000:3000 social-network`

- Option C — Mode développement (hot reload sans rebuild):
  1) Assurez-vous d'avoir `.env` et que le port Postgres local n'entre pas en conflit (voir `docker-compose.yml`).
  2) Lancez uniquement le profil dev: `docker compose --profile dev up app-dev db`.
  3) Modifiez le code localement: l'app se recharge automatiquement (volumes montés + `bun dev`).
  4) Les dépendances sont installées dans un volume dédié (`app-node-modules`), et les migrations Prisma se déploient automatiquement.

Fichiers liés:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
