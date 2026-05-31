# Veille technique et recherche personnelle

## Objectif

Documenter la démarche d'apprentissage continu et les recherches techniques personnelles menées **au-delà du cadre de la formation Zone01**. Cette section répond à un attendu implicite du RNCP CDA et valorise la capacité d'auto-formation d'un développeur en reconversion.

L'approche est concrète : pour chaque domaine exploré, je détaille **pourquoi**, **comment**, **ce que j'ai découvert** et **comment ça se traduit dans le projet Social Network**.

---

## 1. Domaines techniques explorés

### 1.1 Server-Sent Events vs WebSockets vs polling

**Contexte :** le besoin métier (chat temps réel + notifications) imposait du push serveur → client. Trois options se présentaient.

**Question initiale :** « Faut-il un WebSocket persistant comme Socket.io, ou peut-on faire plus simple ? »

**Recherche menée :**

- Lecture de la [spec WHATWG sur Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- Étude des limitations de Vercel serverless : pas de WebSocket TCP long-vivant, fonctions limitées à 60 s par défaut
- Comparaison Upstash Redis (REST) vs Redis classique (TCP) : Upstash s'aligne sur le modèle serverless mais perd le pub/sub natif

**Conclusion appliquée au projet :**

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| Socket.io + Redis pub/sub | Latence très basse, bidirectionnel | Incompatible serverless Vercel, ops complexes |  |
| WebSocket natif | Standard, bidirectionnel | Idem (incompatible Vercel) |  |
| **Server-Sent Events + Upstash Redis polling** | Compatible serverless, unidirectionnel suffit pour push | Polling = latence ~1 s |  retenu |
| Long polling brut | Trivial | Doublonne SSE en moins propre |  |

→ Implémentation détaillée dans [04-developpement/README.md § Temps réel](./README.md#temps-réel-server-sent-events--upstash-redis).

**Apprentissage transverse :** le choix d'une plateforme (serverless vs serveur long-vivant) contraint plus la stack que le choix du langage. Penser **architecture de déploiement avant choix techno** est un raccourci utile pour ne pas se planter.

---

### 1.2 JWT stateless vs sessions Redis

**Question initiale :** « Pourquoi pas NextAuth ? Pourquoi un JWT custom ? »

**Recherche menée :**

- Lecture de la [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) (JSON Web Tokens)
- Documentation de `jose` (lib JOSE en TypeScript) vs `jsonwebtoken` (ancienne lib Node)
- Articles sur le choix HS256 vs RS256 (HMAC vs asymétrique)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

**Conclusions :**

- HS256 suffit pour un projet single-issuer single-verifier (le secret reste côté serveur). RS256 serait nécessaire si plusieurs services indépendants devaient vérifier les tokens.
- `jose` est plus moderne que `jsonwebtoken` (typé, supporte les Web Crypto API, fonctionne en Edge runtime Next.js).
- Cookie `httpOnly` + `SameSite=Lax` est la combinaison standard contre XSS et CSRF.
- Le compromis stateless est connu : pas de révocation instantanée. Solution prévue en roadmap : table `revoked_tokens` ou versioning de tokens.

**Découverte personnelle :** NextAuth était une fausse bonne idée pour ce projet. Implémenter le JWT à la main m'a fait comprendre tout le flow (signature → cookie → middleware → header `x-user-id`) au lieu de cacher la complexité dans une abstraction.

---

### 1.3 Prisma : pourquoi et limites

**Question initiale :** « Quel ORM pour TypeScript en 2025 ? »

**Recherche menée :**

- Comparaison Prisma 6 / Drizzle / Kysely / TypeORM
- Lecture du blog Prisma sur le passage de Prisma 5 → 6 (changements de comportement transactions)
- Benchmark perso : `db.user.findMany({ include: { posts: true } })` vs équivalent Drizzle

**Conclusions :**

- **Prisma** retenu pour : DX excellente (autocomplétion sur les relations), migrations automatiques, schéma déclaratif lisible par non-dev.
- **Drizzle** considéré : plus performant, plus proche du SQL, mais courbe d'apprentissage plus raide et moins d'intégration Next.js out-of-the-box.
- **Limite Prisma** acceptée : abstraction qui peut masquer des N+1 queries. Mitigée par `include` ciblés et `select` minimaux dans `src/lib/db/queries/`.

**Apprentissage transverse :** un ORM n'est pas qu'un confort syntaxique — c'est une vraie surface d'attaque pour les performances. Apprendre à lire les requêtes SQL générées par Prisma (`?logs=query` en dev) a été un déclic.

---

### 1.4 Bun en runtime production

**Question initiale :** « Bun est-il prêt pour la prod en 2025 ? »

**Recherche menée :**

- Suivi du [changelog Bun 1.x](https://bun.sh/blog)
- Tests perso : `bun install` vs `npm install` (5-10× plus rapide), `bun run` vs `node` (démarrage plus rapide)
- Lecture de retours d'expérience prod sur Reddit / HN

**Conclusions :**

- Bun 1.x est stable pour les workloads classiques (Next.js, REST API, scripts).
- L'image Docker `oven/bun:1` est lightweight et bien maintenue.
- Compatibilité avec npm packages : 99 % OK pour le projet (seul ts-jest a demandé un flag `--experimental-vm-modules`).

**Choix dans le projet :** Bun en runtime (image Docker) + en package manager (`bun.lock`), mais `package-lock.json` conservé pour interop avec les outils qui ne connaissent que npm. Le CI utilise `oven-sh/setup-bun@v1`.

**Apprentissage transverse :** adopter une techno récente en prod implique d'avoir un plan B (rollback vers Node 20 reste trivial : il suffit de changer l'image Docker et d'utiliser `npm ci`).

---

### 1.5 Sécurité applicative — au-delà du cours

**Question initiale :** « Quelles sont les vraies vulnérabilités d'une appli Next.js moderne ? »

**Recherche menée :**

- Lecture complète de l'[OWASP Top 10 2021](https://owasp.org/Top10/)
- Audit du code projet avec ces critères (résultats dans [securite-rgpd.md](./securite-rgpd.md))
- Documentation CNIL sur le RGPD pour applications grand public

**Découvertes appliquées au projet :**

- Correction de la vulnérabilité XSS dans `ChatMessage.tsx` — `DOMPurify.sanitize()` appliqué sur `dangerouslySetInnerHTML` (ALLOWED_TAGS restreints à `strong`, `em`, `br`)
- Implémentation du rate limiting anti-brute force via `@upstash/ratelimit` sur `/login` et `/register` (sliding window 5 req/60s/IP)
- Mise en place du flag `oauth_state` cookie pour le flow Google OAuth (anti-CSRF)
- Cookie `authToken` avec `SameSite=Lax + httpOnly + secure` (combinaison alignée sur les recommandations OWASP)

**Apprentissage transverse :** la sécurité ne s'ajoute pas, elle s'imagine dès la conception. Le middleware `deny-by-default` est l'illustration : un développeur qui crée une nouvelle route privée n'a rien à faire pour qu'elle soit protégée, c'est l'état par défaut.

---

### 1.6 Architecture serverless vs serveur traditionnel

**Question initiale :** « Que change vraiment le serverless pour la conception ? »

**Recherche menée :**

- Articles Vercel sur les limites des fonctions serverless (cold start, durée max, mémoire)
- Comparaison avec un déploiement Node classique (PM2 sur VPS)
- Étude du concept de « stateless by design »

**Conséquences directes sur le projet :**

- Pas de WebSocket persistant → adoption SSE
- Pas de sessions in-memory → JWT stateless ou Redis externe
- Pas de fichiers locaux persistants → médias stockés sur Cloudinary
- Migrations à exécuter dans le `CMD` du conteneur, pas dans un job séparé
- Healthcheck endpoint pour la plateforme

**Apprentissage transverse :** ces contraintes sont en fait des bonnes pratiques cloud-native qui poussent à une architecture plus propre. Un serveur stateful est plus simple à coder mais beaucoup plus difficile à scaler.

---

## 2. Sources d'apprentissage

Hiérarchisées du plus dense au plus pratique.

### Documentation officielle (source primaire, toujours)

- [Next.js 15 Docs](https://nextjs.org/docs) — App Router, Server Actions, Middleware
- [React 19 Docs](https://react.dev) — hooks, Suspense, Server Components
- [Prisma Docs](https://www.prisma.io/docs) — schéma, migrations, queries
- [PostgreSQL Docs](https://www.postgresql.org/docs/) — quand Prisma ne suffit pas
- [MDN Web Docs](https://developer.mozilla.org/) — référence absolue pour les standards web
- [WHATWG specs](https://spec.whatwg.org/) — pour SSE, fetch, EventSource
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) — types avancés, génériques

### Sécurité et bonnes pratiques

- [OWASP Top 10](https://owasp.org/Top10/) et [Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CNIL — Guide sécurité](https://www.cnil.fr/sites/cnil/files/atoms/files/guide_securite-vd.pdf)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)

### Articles techniques et retours d'expérience

- [Vercel Engineering Blog](https://vercel.com/blog) — patterns serverless, Edge runtime
- [Prisma Blog](https://www.prisma.io/blog) — release notes, best practices
- [Bun Blog](https://bun.sh/blog) — état de l'art runtime JS alternatif
- [Web.dev](https://web.dev/) — performance, Core Web Vitals, accessibilité

### Communautés

- GitHub Issues des libs utilisées (Next.js, Prisma, jose) — précieux pour comprendre les pièges réels
- Discord Zone01 — entraide quotidienne avec les promos et formateurs
- Stack Overflow — résolution ponctuelle (vérification systématique de la date des réponses, l'écosystème JS évolue vite)

---

## 3. Méthode personnelle de veille

### 3.1 Curation hebdomadaire

Sources suivies chaque semaine :

- Newsletters : [This Week in React](https://thisweekinreact.com/), [Bytes](https://bytes.dev/), [Node Weekly](https://nodeweekly.com/)
- Releases GitHub des libs utilisées (notification activée sur Next.js, Prisma, React)
- Blog d'Anthropic, Vercel, Cloudflare (acteurs majeurs de l'écosystème actuel)

### 3.2 Veille appliquée

Quand un sujet revient (par exemple SSE, Bun, Edge runtime), je vais :

1. lire la **documentation officielle** d'abord, pas un tutoriel YouTube
2. construire un **mini-prototype** isolé (souvent dans un dossier `playground/` local)
3. confronter au **projet réel** (est-ce que ça résout un problème concret ?)
4. **documenter** la décision (commentaire commit, ADR, ou ici cette section)

### 3.3 Outils utilisés pour la veille

- **GitHub** : étoiles + watch sur les libs critiques
- **VS Code + extensions** : ESLint, Prisma, Mermaid Preview, Error Lens
- **Postman / curl** : tester les routes API à la main avant d'écrire le code
- **Chrome DevTools** : Network (analyser les requêtes), Application (cookies/SSE), Performance (profiling)
- **dbdiagram.io** : visualiser le MCD/MLD
- **mermaid.live** : prototyper des diagrammes avant de les valider dans le dossier

---

## 4. Points où je me suis surpris

Section honnête sur ce qui m'a challengé pendant le projet :

- **L'asynchrone côté serveur** : la programmation `async/await` en TypeScript est plus subtile qu'il n'y paraît. Erreur classique : oublier un `await` dans un `try/catch` → l'erreur n'est pas capturée comme prévu. J'ai pris l'habitude de toujours typer le retour des fonctions async, ce qui force le compilateur à m'avertir.

- **Les contraintes Prisma sur les relations** : la première fois que j'ai voulu mettre `onDelete: Cascade` sur une relation `User → Post`, j'ai compris que la modélisation des relations a un impact direct sur la cohérence des données. Penser **scénarios de suppression** dès la modélisation est un réflexe que je n'avais pas.

- **Le SSE côté serveur Next.js** : l'API `ReadableStream` n'est pas évidente quand on vient du modèle Express (`res.write`). Comprendre que le contrôleur doit gérer le `request.signal.aborted` pour ne pas laisser de polling orphelin a été un déclic.

- **Le rôle du middleware Next.js** : au début je le voyais comme une feature accessoire. En fait c'est le seul endroit où je peux centraliser une politique de sécurité au-dessus de toutes les routes. Le pattern « deny-by-default + exceptions explicites » est devenu mon réflexe.

- **L'absence de Chromium dans le sandbox de génération de diagrammes** (cf. section diagrams) : ça m'a fait comprendre que rendre un SVG vectoriel sans navigateur est non-trivial. Pour la prod, on utilise généralement un service externe (kroki, mermaid.ink) ou un Chromium headless dédié.

---

## 5. Application concrète au dossier

Cette veille technique se retrouve **partout** dans le projet :

- Choix SSE + Upstash → [04-developpement/README.md](./README.md)
- Choix JWT custom + audit OWASP → [securite-rgpd.md](./securite-rgpd.md)
- Choix Bun + Docker multi-stage → [05-deploiement/README.md](../05-deploiement/README.md)
- Choix Prisma + migrations → [03-conception/donnees.md](../03-conception/donnees.md)
- Choix Mermaid pour les diagrammes → [03-conception/diagrammes-uml.md](../03-conception/diagrammes-uml.md)

Chaque choix technique est explicité, comparé à ses alternatives, et tracé jusqu'au commit.

---

## 6. Plan de veille post-certification

Domaines que je veux continuer à explorer une fois le titre obtenu :

1. **Edge computing avancé** (Vercel Edge Functions, Cloudflare Workers) — pour les latences ultra-basses
2. **Rust pour le tooling web** (oxc, biome, swc) — performance des outils dev
3. **Observabilité moderne** (OpenTelemetry, Grafana Tempo, Sentry) — au-delà du `console.log`
4. **Bases de données vectorielles** (pgvector, Pinecone) — pour intégrer de l'IA (recommandations, recherche sémantique)
5. **Architecture hexagonale / DDD** appliquée à Next.js — séparation claire domaine vs infrastructure
6. **Sécurité applicative avancée** : certification type OWASP WSTG, lecture du bug bounty Vercel
