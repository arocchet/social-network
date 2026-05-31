# Révision Oral — CDA RNCP 37873
## Christophe Lecart — Session 02 Juin 2026

---

## 1. GLOSSAIRE — Mots clés vulgarisés

### Architecture & Framework

| Terme | Vulgarisation |
|---|---|
| **Next.js App Router** | Framework React qui gère à la fois les pages visibles (frontend) et les routes API (backend) dans un seul projet. L'App Router est la version moderne (depuis Next.js 13) qui permet de choisir composant par composant ce qui est rendu côté serveur ou côté client. |
| **React Server Components (RSC)** | Composants React qui s'exécutent uniquement sur le serveur — ils accèdent directement à la base de données sans passer par une API. Résultat : page plus rapide, zéro JavaScript envoyé au navigateur pour ces composants. |
| **Client Components** | Composants React classiques qui s'exécutent dans le navigateur — nécessaires pour l'interactivité (boutons, formulaires, animations). On les déclare avec `'use client'` en haut du fichier. |
| **Middleware Next.js** | Code qui s'exécute avant chaque requête. Dans le projet, il vérifie le JWT à chaque accès à une route `/api/private/*` ou page protégée — si pas de token valide, redirection vers `/login`. |
| **API Routes** | Endpoints backend intégrés dans Next.js. Un fichier `route.ts` dans `src/app/api/` devient automatiquement un endpoint HTTP. On a 60+ endpoints organisés en `/api/public/` (libre) et `/api/private/` (protégé). |
| **Hooks React** | Fonctions JavaScript commençant par `use` qui encapsulent de la logique réutilisable côté client. Ex: `useNotifications` gère l'abonnement SSE aux notifications. Le projet en a 30+. |
| **TypeScript strict** | Version typée de JavaScript — chaque variable, paramètre et retour de fonction a un type déclaré. Évite les erreurs à l'exécution en les détectant à la compilation. |

---

### Base de données & ORM

| Terme | Vulgarisation |
|---|---|
| **Prisma ORM** | Outil qui fait le lien entre le code TypeScript et la base PostgreSQL. On décrit les tables dans `schema.prisma`, Prisma génère un client TypeScript avec autocomplétion. Plus besoin d'écrire du SQL à la main. |
| **Schéma Prisma** | Fichier `prisma/schema.prisma` qui décrit toutes les tables (modèles), leurs colonnes, types et relations. C'est la source de vérité de la base de données — 18 modèles dans le projet. |
| **Migration Prisma** | Fichier SQL généré automatiquement quand on modifie le schéma. `prisma migrate deploy` applique ces changements en production sans perdre les données existantes. |
| **Relation many-to-many** | Un utilisateur peut être dans plusieurs groupes, un groupe peut avoir plusieurs utilisateurs. Prisma gère ça via une table intermédiaire `ConversationMember`. |
| **Contrainte d'unicité** | Règle en base qui interdit les doublons. Ex: un user ne peut liker un post qu'une seule fois — `@@unique([userId, postId])` dans le modèle Reaction. |
| **N+1 problem** | Bug de performance : pour afficher 10 posts avec leurs auteurs, on fait 1 requête pour les posts + 10 requêtes pour chaque auteur = 11 requêtes. Solution : `include` Prisma qui récupère tout en une seule requête SQL. |
| **Pagination offset** | Technique pour paginer les résultats : `skip: 20, take: 10` = sauter les 20 premiers, prendre les 10 suivants. Simple à implémenter, utilisé dans le projet. |
| **Seed** | Script qui insère des données de test en base pour les démonstrations locales. Fichier `prisma/seed.ts`. |

---

### Authentification & Sécurité

| Terme | Vulgarisation |
|---|---|
| **JWT (JSON Web Token)** | Token signé numériquement qui contient l'identité de l'utilisateur (`userId`). Le serveur le génère à la connexion, le client le renvoie à chaque requête. Pas besoin de stocker les sessions en base. |
| **HS256** | Algorithme de signature du JWT. Le serveur signe le token avec une clé secrète (`JWT_SECRET`). Si quelqu'un modifie le token, la signature ne correspond plus — requête refusée. |
| **JWT stateless** | Le serveur ne stocke pas les sessions. Il vérifie juste la signature du token à chaque requête. Avantage : scalable. Inconvénient : impossible de révoquer un token avant son expiration (480min). |
| **Cookie httpOnly** | Cookie que JavaScript ne peut pas lire. Protège contre XSS : même si du code malveillant s'exécute dans le navigateur, il ne peut pas voler le token. |
| **SameSite=Lax** | Attribut du cookie qui bloque son envoi depuis un autre site. Protège contre CSRF (un site malveillant ne peut pas faire des requêtes en ton nom). |
| **bcrypt** | Algorithme de hachage pour les mots de passe. Irréversible — même avec la base de données, on ne peut pas retrouver le mot de passe original. Salt rounds=12 dans le projet. |
| **Salt** | Données aléatoires ajoutées au mot de passe avant le hachage. Empêche les attaques par tables arc-en-ciel (rainbow tables). |
| **Zod** | Bibliothèque de validation de données. On définit un schéma (ex: email valide, password min 6 chars) et Zod vérifie les données entrantes. Si invalide → rejet 400 avant même d'atteindre la logique métier. |
| **Middleware JWT** | Vérification systématique du token à chaque requête vers `/api/private/*`. Si token absent → 401. Si token expiré → redirection /login. Si token valide → `x-user-id` injecté dans les headers. |
| **OWASP Top 10** | Liste des 10 vulnérabilités web les plus courantes (SQL injection, XSS, CSRF, etc.). Le projet adresse les principales via Prisma (SQL), cookies httpOnly (XSS), SameSite (CSRF). |
| **Injection SQL** | Attaque qui consiste à injecter du SQL dans un champ (`' OR 1=1--`). Prisma paramétrise toutes les requêtes automatiquement — attaque impossible. |
| **XSS** | Injection de JavaScript malveillant dans une page. Les cookies httpOnly limitent l'impact. Corrigé dans `ChatMessage.tsx` via `DOMPurify.sanitize()` sur `dangerouslySetInnerHTML`. |
| **Énumération utilisateurs** | Technique pour deviner les emails enregistrés. Le projet retourne le même message `"Invalid email or password"` que l'email existe ou non — anti-énumération. |
| **OAuth 2.0** | Protocole qui permet de se connecter avec un compte Google sans donner son mot de passe à l'application. Le projet l'implémente manuellement (pas next-auth). |

---

### Temps réel

| Terme | Vulgarisation |
|---|---|
| **SSE (Server-Sent Events)** | Connexion HTTP longue durée du navigateur vers le serveur. Le serveur peut envoyer des données à tout moment sans que le client les demande. Unidirectionnel (serveur → client uniquement). |
| **WebSocket** | Connexion bidirectionnelle persistante. Plus performant que SSE mais incompatible avec Vercel serverless. Non utilisé dans le projet — choix assumé. |
| **Polling SSE** | Mécanisme du projet : l'endpoint SSE vérifie une clé Redis toutes les ~500ms. Si nouvelle valeur détectée → event envoyé au client. Latence <1s. |
| **Upstash Redis** | Service Redis sans serveur (REST HTTP). Dans le projet : buffer de messages pour SSE. Clés `latest:chat:{from}:{to}` mises à jour à chaque message envoyé, lues par l'endpoint SSE. |
| **Serverless** | Fonctions qui s'exécutent à la demande sans serveur dédié. Vercel héberge Next.js en serverless — chaque requête API démarre une nouvelle instance. Incompatible avec les connexions persistantes (WebSocket). |
| **Typing indicator** | Indicateur "en train d'écrire...". Implémenté via SSE + clé Redis `typing:{conversationId}:{userId}` avec TTL court (~3s). |
| **Message status** | Statut des messages : `SENT` → `DELIVERED` → `READ`. Stocké en base Prisma, mis à jour via `PUT /api/private/messages/[id]/status`. |

---

### Déploiement & Infrastructure

| Terme | Vulgarisation |
|---|---|
| **Docker** | Outil qui empaquette l'application et ses dépendances dans un conteneur isolé. Même comportement sur tous les environnements. |
| **Dockerfile multi-stage** | Dockerfile en 2 étapes : `builder` compile l'app (avec toutes les dépendances dev), `runner` ne contient que le strict nécessaire pour la prod. Image finale plus légère. |
| **docker-compose** | Orchestre plusieurs services Docker. Dans le projet : 2 profils — `app` (prod) et `app-dev` (dev avec hot reload). Neon et Upstash sont externes, pas dans compose. |
| **Vercel** | Plateforme d'hébergement pour Next.js. Déploiement automatique à chaque push sur `main`. Génère des URLs de preview pour chaque PR. |
| **Neon DB** | PostgreSQL serverless dans le cloud. Se connecte via `DATABASE_URL`. Utilisé en prod et en dev (pas de Postgres local). |
| **Variables d'environnement** | Secrets injectés au runtime (JWT_SECRET, DATABASE_URL, etc.). Jamais committés en git. Gérés dans `.env` en local, dans le dashboard Vercel en prod. |
| **Prisma migrate deploy** | Commande qui applique les migrations Prisma en production. Lancée automatiquement au démarrage du conteneur Docker (`CMD` du Dockerfile). |
| **SonarQube** | Outil d'analyse statique de code. `sonar-project.properties` configuré dans le projet. |

---

## 2. QUESTIONS JURY — Questions / Réponses

### Authentification

**Q : Pourquoi avoir choisi JWT plutôt que des sessions en base ?**
> JWT est stateless — le serveur ne stocke rien, il vérifie juste la signature. C'est adapté à Vercel serverless où chaque requête peut atterrir sur une instance différente. Avec des sessions en base, il faudrait que toutes les instances partagent le même stockage de sessions.

**Q : Quelle est la durée de vie du token JWT ?**
> Le JWT expire après 480 minutes (8 heures). Le cookie qui le contient a un maxAge de 7 jours. Après 8h, le cookie est encore là mais le middleware rejette le JWT expiré et redirige vers /login.

**Q : Comment protégez-vous les routes privées ?**
> Le middleware Next.js (`src/middleware.ts`) intercepte toutes les requêtes vers `/api/private/*` et les pages protégées. Il extrait le JWT du cookie, vérifie la signature avec `jose`, et injecte le `userId` dans les headers si valide. Si le token est absent ou expiré → 401 ou redirection /login.

**Q : Que se passe-t-il si quelqu'un modifie le JWT ?**
> La signature HS256 ne correspond plus à la clé secrète du serveur. `jwtVerify` (jose) lève une erreur → requête rejetée. L'algorithme est cryptographiquement sûr.

**Q : Pourquoi stocker le token dans un cookie et pas localStorage ?**
> localStorage est accessible depuis JavaScript — une attaque XSS pourrait le voler. Un cookie httpOnly est invisible du JavaScript, même en cas de code malveillant injecté dans la page.

---

### Base de données

**Q : Expliquez votre modèle de données — pourquoi 18 modèles ?**
> Chaque entité métier a son modèle : User, Post, Comment, Reaction, Story, Message, Conversation (qui sert aussi de groupe via `isGroup:true`), ConversationMember, GroupMessage, Friendship, Notification, Event, Rsvp, UserSettings, Account, GroupInvitation, GroupJoinRequest, GroupMember. Chaque modèle correspond à une table PostgreSQL avec ses relations et contraintes.

**Q : Comment gérez-vous les groupes ? Il n'y a pas de modèle Group ?**
> C'est un choix de conception : un groupe est une `Conversation` avec `isGroup: true`. Ça évite la duplication de logique entre chat direct et chat de groupe. Les membres, invitations et messages de groupe référencent l'ID de cette Conversation.

**Q : Qu'est-ce qu'une migration Prisma ?**
> Quand on modifie `schema.prisma`, Prisma génère un fichier SQL de migration versionné. `prisma migrate deploy` applique ce fichier sur la base de production sans recréer le schéma depuis zéro — les données existantes sont préservées.

**Q : Comment évitez-vous le problème N+1 ?**
> Avec `include` Prisma qui charge les relations en une seule requête SQL. Par exemple pour le feed : `db.post.findMany({ include: { author: true, reactions: true, _count: { select: { comments: true } } } })` — un seul appel base de données.

---

### Temps réel

**Q : Pourquoi SSE plutôt que WebSocket ?**
> Vercel serverless ne supporte pas les connexions WebSocket persistantes — chaque fonction s'exécute en mode stateless et se termine. SSE utilise une requête HTTP longue durée compatible avec ce modèle. On perd le bidirectionnel natif mais c'est compensé par des endpoints POST séparés pour l'envoi.

**Q : Comment fonctionne concrètement votre système temps réel ?**
> Le client ouvre une connexion SSE vers `/api/private/chat/listen`. L'endpoint poll Upstash Redis toutes les 500ms sur la clé `latest:chat:{from}:{to}`. Quand un message est envoyé via `POST /api/private/chat/send`, il est d'abord persisté en Prisma puis la clé Redis est mise à jour. Le polling détecte la nouvelle valeur et envoie l'event SSE au client. Latence <1s.

**Q : Que se passe-t-il quand le client se déconnecte ?**
> L'endpoint SSE écoute `request.signal.addEventListener('abort', ...)`. Quand la connexion est fermée, le signal est aborted, le polling s'arrête proprement — pas de ressource orpheline côté serveur.

---

### Architecture

**Q : Quelle est la différence entre `/api/public/` et `/api/private/` ?**
> `/api/public/` regroupe les endpoints accessibles sans authentification : login, register, OAuth callback. `/api/private/` regroupe tout le reste — protégé par le middleware JWT. Cette séparation est explicite dans l'arborescence des fichiers.

**Q : Comment validez-vous les données entrantes ?**
> Avec Zod. Chaque endpoint définit un schéma Zod (types, contraintes, formats). Les données sont parsées dès l'entrée — si invalide, Zod lève une erreur transformée en réponse 400 avant d'atteindre la logique métier.

**Q : Comment gérez-vous les erreurs API ?**
> Deux helpers : `respondSuccess(data)` et `respondError(message)` qui retournent une structure JSON standardisée. Les status HTTP correspondent aux conventions REST : 200/201 succès, 400 validation, 401 non authentifié, 403 non autorisé, 404 ressource introuvable, 500 erreur serveur.

---

### Tests

**Q : Quelle est votre stratégie de tests ?**
> Trois niveaux : tests unitaires UI (Jest + React Testing Library — 5 tests sur le composant Button), tests d'intégration backend (2 tests Jest sur les routes auth register et login avec vraie base de données), et 38 jeux d'essai manuels documentés couvrant auth, messagerie, posts, groupes et sécurité.

**Q : Pourquoi si peu de tests automatisés ?**
> C'est la limite honnête du projet. L'infrastructure Jest est en place et fonctionnelle. La priorité post-certification sera d'implémenter les tests d'intégration sur les 10 routes critiques identifiées dans `tests-strategy.md`, puis les tests E2E Playwright sur 5 parcours utilisateur.

**Q : Comment avez-vous testé la sécurité ?**
> Par jeux d'essai manuels documentés : injection SQL (Prisma paramétrise — aucun effet), accès données d'un autre utilisateur (403 via vérification ownership), token falsifié (middleware rejette), accès route protégée sans token (redirection /login). Le rate limiting est implémenté sur `/login` et `/register` (5 req/60s/IP via `@upstash/ratelimit`).

---

### Déploiement

**Q : Expliquez votre Dockerfile multi-stage.**
> Stage 1 (`builder`) : image `oven/bun:1`, installe toutes les dépendances y compris dev, génère le client Prisma (`prisma generate`), compile Next.js (`bun run build`). Stage 2 (`runner`) : image propre, copie uniquement `.next`, `node_modules`, `package.json`, `public`, `prisma`. Image finale allégée sans les outils de build.

**Q : Pourquoi Vercel pour le déploiement ?**
> Intégration native avec Next.js (même éditeur), déploiement automatique à chaque push sur `main`, preview URLs pour chaque PR, gestion des variables d'environnement intégrée, edge network mondial. Zéro configuration serveur.

**Q : Comment gérez-vous les migrations en production ?**
> Le `CMD` du Dockerfile lance `bunx prisma migrate deploy && bun run start`. À chaque redémarrage du conteneur, les migrations en attente sont appliquées avant le démarrage de l'application.

---

### Questions pièges courantes

**Q : Vous dites que le projet est sécurisé — qu'est-ce qui ne l'est pas ?**
> J'assume une limite principale : pas de révocation JWT avant expiration (architecture stateless pur — une liste noire Redis résoudrait ça). En revanche le rate limiting est en place sur `/login` et `/register` (5 req/60s via `@upstash/ratelimit`), et la XSS dans `ChatMessage.tsx` est corrigée via `DOMPurify.sanitize()`.

**Q : Pourquoi pas de refresh tokens ?**
> Choix délibéré de simplicité. JWT stateless avec expiration 480min. À la déconnexion, le cookie est supprimé. Après expiration, l'utilisateur se reconnecte. Un système de refresh tokens aurait nécessité du stockage serveur, contrairement à l'objectif serverless. C'est un axe d'amélioration identifié.

**Q : Qu'est-ce que vous referiez différemment ?**
> Mettre en place les tests d'intégration dès le début plutôt qu'à la fin. Implémenter le rate limiting dès les premières routes auth. Peut-être séparer les notifications dans un service dédié plutôt que le modèle String libre actuel.

**Q : C'est quoi Konekt ?**
> C'est le nom donné par l'équipe au projet "Social Network" de l'école. Zone01 appelle le projet "Social Network", on l'a baptisé Konekt. C'est la même application.

**Q : Combien étiez-vous dans l'équipe ?**
> À préciser selon ta réalité — prépare ta réponse sur la répartition du travail et ta contribution personnelle.

---

## 3. CHIFFRES CLÉS à retenir

| Indicateur | Valeur |
|---|---|
| Modèles Prisma | 18 |
| Endpoints API | 60+ (63 fichiers route.ts) |
| Composants React | 110+ |
| Hooks personnalisés | 30+ |
| User stories | 43 |
| Tests automatisés | 7 (5 UI + 2 intégration) |
| Jeux d'essai documentés | 38 |
| JWT expiration | 480min (8h) |
| Cookie maxAge | 7 jours |
| bcrypt salt rounds | 12 |
| Password minimum | 6 caractères (Zod) |
| Types de réactions | 7 (LIKE, DISLIKE, LOVE, LAUGH, SAD, ANGRY, WOW) |
| Types de notifications implémentés | 2 (GROUP_INVITATION, message_status_update) |
| Issues GitHub fermées | 59 |
