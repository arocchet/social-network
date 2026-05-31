# Support Oral — Arguments à Développer
## Christophe Lecart · CDA RNCP 37873 · 2 juin 2026

> **Comment utiliser ce support :** Chaque argument est un fil conducteur à dérouler à voix haute. Pas besoin de tout mémoriser — comprends la logique, le jury voit si tu récites ou si tu expliques vraiment.

---

## ARGUMENT 1 — "Pourquoi Next.js plutôt qu'un vrai frontend + vrai backend séparés ?"

**Ce que tu dis :**
> "On aurait pu faire React seul côté client et une API Express séparée. On a choisi Next.js parce qu'il nous donne les deux dans un seul projet : les Server Components s'exécutent côté serveur et accèdent directement à la base de données, les API Routes sont nos endpoints REST. C'est une architecture monolithique moderne, adaptée à une équipe réduite — moins de déploiements à gérer, moins de surfaces d'erreur."

**Ce que ça montre :** tu as fait un choix d'architecture, pas subi un outil.

**Si on te pousse :**
- Inconvénient ? Couplage fort frontend/backend. Sur un projet plus grand, on séparerait.
- Pourquoi pas Nest.js, Spring, Django ? Parce que l'équipe maîtrisait TypeScript et la stack JS — cohérence de compétences.

---

## ARGUMENT 2 — "Comment fonctionne votre authentification ?"

**Ce que tu dis :**
> "L'utilisateur envoie son email et son mot de passe. On vérifie le hash bcrypt en base. Si ça correspond, on génère un JWT signé avec une clé secrète (HS256). Ce token est placé dans un cookie httpOnly — JavaScript du navigateur ne peut pas le lire. À chaque requête vers une route privée, le middleware Next.js intercepte, vérifie la signature JWT, et injecte le userId dans les headers si tout est valide."

**La logique en 3 mots :** Hachage → Token → Cookie protégé.

**Si on te pousse :**
- Pourquoi pas des sessions en base ? JWT est stateless — parfait pour Vercel serverless où chaque requête peut tomber sur une instance différente.
- Peut-on révoquer un token ? Non, c'est une limite assumée. Solution : liste noire Redis, identifiée comme axe d'amélioration.
- Différence JWT exp (480min) vs cookie maxAge (7j) ? Le cookie dure 7j mais le JWT dedans expire à 8h — le middleware rejette le JWT expiré même si le cookie est encore là.

---

## ARGUMENT 3 — "Pourquoi SSE et pas WebSocket pour le temps réel ?"

**Ce que tu dis :**
> "Vercel héberge Next.js en mode serverless : chaque requête est une fonction qui démarre et se termine. Une connexion WebSocket est persistante — incompatible avec ce modèle. On a choisi SSE : une requête HTTP longue durée du client vers le serveur, compatible serverless. Le serveur ne pousse pas directement — il pollait une clé Redis toutes les 500ms. Quand un message arrive, la clé Redis est mise à jour, le poll la détecte, et l'event est envoyé au client. Latence < 1 seconde."

**La logique :** Contrainte infra → choix SSE + Redis comme pont.

**Si on te pousse :**
- SSE vs WebSocket ? SSE est unidirectionnel (serveur → client), WebSocket bidirectionnel. On compense avec des endpoints POST séparés pour l'envoi.
- Que se passe-t-il à la déconnexion du client ? `request.signal.addEventListener('abort', ...)` — le polling s'arrête proprement, pas de ressource orpheline.
- Et si Vercel ajoutait le support WebSocket ? On migrerait, c'est un choix de contrainte pas un choix de préférence.

---

## ARGUMENT 4 — "Expliquez votre modèle de données"

**Ce que tu dis :**
> "18 modèles Prisma dans schema.prisma — chaque entité métier a son modèle. La décision de conception la plus intéressante : les groupes ne sont pas un modèle Group séparé. Ce sont des Conversations avec isGroup: true. Ça évite de dupliquer toute la logique de messagerie. Un groupe, c'est une conversation avec plusieurs membres, des messages de groupe, et des événements. La relation amicale aussi est modélisée explicitement comme Friendship avec statut PENDING/ACCEPTED — pas juste un tableau d'IDs."

**Si on te pousse :**
- N+1 problem ? Avec `include` Prisma — une seule requête SQL qui charge les relations.
- Migrations ? `prisma migrate deploy` applique les fichiers SQL versionnés sans recréer le schéma — données préservées.
- Contraintes d'unicité ? `@@unique([userId, postId])` sur les réactions — impossible de liker deux fois.

---

## ARGUMENT 5 — "Comment avez-vous travaillé en équipe ?"

**Ce que tu dis (argument fort — contexte particulier) :**
> "L'équipe était en alternance à des rythmes différents — travailler en synchrone était structurellement impossible. On a compensé par des pratiques GitHub professionnelles : aucun push direct sur main, tout passe par une PR. La branche main est protégée — merge impossible sans checks au vert. Vercel génère automatiquement un environnement de preview pour chaque PR — on pouvait tester le rendu réel avant de merger. Moi j'étais le seul sans alternance, ce contexte m'a forcé à acquérir très tôt les réflexes d'un développeur en équipe distribuée."

**Ce que ça montre :** maturité professionnelle, pas juste du code.

---

## ARGUMENT 6 — "Qu'est-ce qui n'est pas sécurisé ?"

**Ce que tu dis (argument d'honnêteté — le jury teste ça) :**
> "J'assume une limite principale : pas de révocation JWT avant expiration — architecture stateless pur, une liste noire Redis résoudrait ça. En revanche le rate limiting est en place sur /login et /register (5 req/60s via @upstash/ratelimit), et la XSS dans ChatMessage.tsx est corrigée via DOMPurify.sanitize() avec ALLOWED_TAGS restreints."

**Pourquoi cet argument est important :** un développeur qui connaît ses limites est plus crédible qu'un développeur qui prétend que tout est parfait.

---

## ARGUMENT 7 — "Expliquez votre déploiement"

**Ce que tu dis :**
> "Deux cibles de déploiement. Vercel pour la prod : déploiement automatique à chaque push sur main, serverless, edge network mondial. Docker pour l'auto-hébergement : Dockerfile multi-stage — stage builder compile avec toutes les dépendances, stage runner ne garde que le strict nécessaire. Les migrations Prisma s'exécutent automatiquement au démarrage du conteneur. Les secrets ne sont jamais committés — variables d'environnement dans .env en local, dashboard Vercel en prod."

**Si on te pousse :**
- Pourquoi multi-stage ? Image finale plus légère — les outils de build ne sont pas en production.
- Neon DB ? PostgreSQL serverless dans le cloud — pas besoin d'un serveur de base de données à gérer.

---

## ARGUMENT 8 — "Que referiez-vous différemment ?"

**Ce que tu dis (montre le recul) :**
> "Les tests d'abord. On a mis en place les tests unitaires et d'intégration trop tard — si l'infra Jest avait été là dès le début, on aurait détecté des régressions plus tôt. Je mettrais en place les tests d'intégration dès les premières routes. Et j'étendrais le rate limiting à tous les endpoints sensibles dès le début, pas uniquement à /login et /register. Et sur la modélisation, je réfléchirais plus tôt aux notifications — le modèle String libre pour le type de notification manque de rigueur, un enum aurait été plus solide."

---

## CHIFFRES À AVOIR EN TÊTE (sans hésiter)

| Ce que le jury peut demander | Réponse |
|---|---|
| Endpoints API | 60+ |
| Modèles Prisma | 18 |
| Composants React | 110+ |
| Hooks personnalisés | 30+ |
| User stories | 43 |
| JWT expiration | 480 min (8h) |
| Cookie maxAge | 7 jours |
| bcrypt salt rounds | 12 |
| Types de réactions | 7 |
| Latence SSE | < 1s |
| Polling Redis | ~500ms |

---

## PHRASE D'ACCROCHE si on te demande "Présentez votre projet"

> "Konekt est un réseau social full-stack développé dans le cadre de la formation Zone01. C'est un projet collaboratif qui couvre l'ensemble du cycle : conception, développement sécurisé, et déploiement. La particularité technique : tout repose sur Next.js — à la fois le frontend React et le backend API. L'authentification est JWT stateless, le temps réel passe par SSE et Upstash Redis, et le déploiement est double : Vercel pour la prod, Docker pour l'auto-hébergement."

---

## CE QUE LE JURY VEUT ENTENDRE

- **Tu as fait des choix** — pas juste utilisé des outils (pourquoi Next.js, pourquoi SSE, pourquoi JWT)
- **Tu connais tes limites** — pas de révocation JWT, rate limiting à étendre sur /chat/send, pas de refresh tokens
- **Tu comprends ce que tu as codé** — middleware, bcrypt, N+1
- **Tu sais travailler en équipe** — GitHub flow, PRs, reviews
- **Tu as du recul** — ce que tu referais différemment
