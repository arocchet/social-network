# 06 - Bilan

## Objectif

Présenter le retour d'expérience sur le projet, les acquis techniques, les limites constatées et les pistes d'évolution réalistes dans une logique de certification.

---

## Retour d'Expérience

### Défis Techniques Rencontrés

1. **Auth middleware et sécurité des routes**
   - Gérer les cookies HTTP-only côté serveur sans exposer les jetons au client.
   - Synchroniser middleware Next.js, validations JWT (jose) et route handlers protégées.
   - Implémenter correctement le hachage bcrypt et la vérification des mots de passe.
   - Résultat : authentification robuste et vérifiée à chaque requête protégée.

2. **Temps réel sans WebSocket persistant (SSE + Upstash Redis)**
   - Le choix Vercel serverless + Upstash REST a écarté Socket.io. Il a fallu construire un mécanisme push compatible serverless : endpoints `/api/private/chat/listen` (Server-Sent Events) qui pollent Upstash Redis sur des clés `latest:chat:*`.
   - Garantir la persistance Prisma avant la mise à jour de la clé Redis pour éviter les pertes ou les messages incohérents.
   - Gérer la déconnexion/reconnexion et éviter les duplicatas côté client.
   - Gérer proprement la fermeture du flux SSE côté client (`request.signal.addEventListener("abort", ...)`) pour ne pas laisser de polling orphelin côté serveur.
   - Résultat : notifications et messages en temps réel fiables avec latence acceptable.

3. **Modélisation Prisma complexe**
   - 18 modèles avec 40+ relations et contraintes d'unicité (userId + postId pour les likes).
   - Maintenir l'intégrité référentielle tout en permettant les suppressions en cascade.
   - Migrer sans perdre les données existantes lors du passage à de nouveaux schémas.
   - Résultat : base de données normalisée, performante et facilement maintenue.

4. **Coordination frontend/backend**
   - Aligner les types TypeScript côté client et serveur pour éviter les regressions.
   - Valider les données à l'entrée (Zod) et à la sortie (Prisma types).
   - Gérer les erreurs API de manière cohérente (400, 401, 500, etc.).
   - Résultat : expérience utilisateur fluide et erreurs explicites.

### Défis d'Organisation et de Documentation

- Structurer un dossier de certification lisible pour jury technique ET non-technique.
- Distinguer : ce qui est dans la documentation vs ce qui reste dans le code source.
- Répartir 60+ pages entre conception, développement, déploiement et bilan sans perdre la cohérence narrative.
- Lier chaque section à des preuves GitHub concrètes (issues, PRs, commits).

### Apprentissages Clés

**Compétences validées :**

- Next.js App Router (server-side rendering, server actions, middleware).
- TypeScript pour la sécurité des types en full-stack.
- PostgreSQL et Prisma pour une modélisation robuste.
- JWT et authentification stateless.
- Déploiement en conteneurs (Docker + Docker Compose).
- Travail en équipe via GitHub (issues, PRs, code review).

**Points d'amélioration identifiés :**

- Tester davantage les routes critiques (auth, chat, notifications).
- Mettre en place du monitoring en production (Sentry, alertes).
- Optimiser le caching Redis pour réduire les requêtes DB.
- Ajouter des benchmarks de performance (Lighthouse, load tests).

---

## Accomplissements Mesurables

### Livrables du Projet

| Élément                 | Nombre     | Statut                                 |
| ----------------------- | ---------- | -------------------------------------- |
| Modèles Prisma          | 18         |  Complets et documentés              |
| Endpoints API           | 60+        |  Spécifications complètes (api-spec.md)      |
| Pages principales       | 14         |  Routes implémentées                         |
| Composants React        | 110+       |  Design system + composants métier           |
| Hooks personnalisés     | 30+        |  Logique UI découplée                        |
| User stories            | 38+        |  Rôles, priorités, critères d'acceptation    |
| Événements temps réel   | 4 familles |  Chat, notifications, typing, statuts        |
| Migrations DB           | 2+         |  Structure versionnée                        |
| Lignes de documentation | 4000+      |  Dossier et code                             |
| Tests d'intégration     | Auth       |  Inscription + connexion vérifiées           |

### Résultats Obtenus

**Synthèse chiffrée :**

- **18 modèles Prisma** documentés.
- **60+ endpoints API** décrits avec payloads et réponses (cf. `api-spec.md`).
- **14 pages principales** couvertes dans la conception.
- **43 user stories** organisées par rôle et priorité.
- **Temps réel via Server-Sent Events + Upstash Redis** documenté de bout en bout (endpoint `chat/listen`, clé Redis, ack côté API).
- **Architecture complète** du projet formalisée pour revue jury.

**Architecture**

- Séparation claire client/serveur/data
- TypeScript full-stack pour la sécurité
- Middleware pour l'authentification centralisée
- API RESTful avec validation (Zod)

 **Authentification & Sécurité**

- JWT avec jose (HS256)
- Hachage bcrypt des mots de passe
- Cookies HTTP-only pour les sessions
- Protection des routes privées

 **Base de Données**

- 18 modèles Prisma normalisés
- Relations complexes (amitié, notifications, groupes)
- Migrations versionnées
- Contraintes d'unicité pour éviter les duplicatas

 **Temps Réel**

- Messages avec statut (SENT → DELIVERED → READ)
- Notifications en temps réel via Upstash Redis
- Typing indicator avec timeout
- Polling SSE pour haute disponibilité (compatible serverless Vercel)

 **Déploiement**

- Dockerfile multi-stage optimisé
- docker-compose avec PostgreSQL (Upstash Redis configuré via env vars)
- Variables d'environnement sécurisées
- Déploiement continu Vercel documenté

 **Documentation**

- Dossier de certification 60+ pages
- Preuves GitHub reliées (13 issues/PRs)
- Diagrammes d'architecture (Mermaid)
- API specification complète

### Points Forts du Projet

- **Pragmatique** : Choix techniques éprouvés (Next.js, Prisma, PostgreSQL).
- **Documenté** : Chaque section du dossier renvoie à du code réel.
- **Sécurisé** : Authentification robuste, validation des données, hachage des mots de passe.
- **Scalable** : Redis pour le cache/buffer SSE, migrations Prisma, indexing DB.
- **Équipe** : Travail collaboratif via GitHub, coordonnés sur 13 issues principales.

### Points à Améliorer (Phase Suivante)

- **Tests** : Augmenter la couverture au-delà de l'authentification (routes sensibles, composants).
- **Performance** : Lighthouse audit, optimisation d'images, compression — relevés réels à compléter.
- **Monitoring** : Intégrer Sentry pour suivi des erreurs en production, formaliser supervision et alertes.
- **Load tests** : Vérifier la scalabilité sous charge (Upstash REST, connexions DB).
- **RGPD** : Implémenter les droits manquants — suppression de compte (droit à l'oubli) et export des données (droit à la portabilité). Voir l'audit complet dans [04-developpement/securite-rgpd.md](../04-developpement/securite-rgpd.md).
- **XSS** : Corrigée dans `ChatMessage.tsx` via `DOMPurify.sanitize()` — ALLOWED_TAGS restreints à `strong`, `em`, `br`.
- **Rate limiting** : Déjà en place sur `/login` et `/register` (5 req/60s/IP). À étendre sur `/chat/send` et les endpoints de création de contenu.
- **Tests E2E** : Implémenter les 5 parcours Playwright critiques (auth, post, chat, groupe, notifications) — setup technique documenté dans `04-developpement/tests-strategy.md`, prêt à déployer.

---

## Compétences Validées (RNCP 37873)

### Bloc 1 : Développer une application sécurisée

-  Authentification JWT sécurisée (jose + bcrypt)
-  Validation des entrées (Zod schemas)
-  Protection des routes (middleware + check userId)
-  Hachage des mots de passe (bcrypt, salt 12)
-  Cookies HTTP-only pour la session

### Bloc 2 : Concevoir une application organisée en couches

- Séparation client/serveur/data
- Next.js App Router et logique server-side
- Composants React réutilisables
- Hooks personnalisés pour la logique métier
- Prisma ORM pour l'accès aux données (modèle relationnel riche, 18 modèles)
- API Routes pour la couche métier
- TypeScript pour sécuriser les contrats de données client/serveur
- Server-Sent Events + Upstash Redis pour le push temps réel sans WebSocket persistant

### Bloc 3 : Préparer le déploiement sécurisé

- Dockerfile multi-stage optimisé
- docker-compose avec services
- Variables d'environnement versionnées
- Migrations Prisma automatisées
- Déploiement continu via intégration Git native Vercel
- Déploiement Vercel (serverless) + Neon (PostgreSQL) + Upstash (Redis)

### Compétences Techniques Consolidées

| Compétence         | Niveau         | Preuve                                      |
| ------------------ | -------------- | ------------------------------------------- |
| Next.js App Router | Intermédiaire+ | `src/middleware.ts`, API routes             |
| TypeScript         | Intermédiaire+ | Typage strict côté client / serveur         |
| PostgreSQL         | Intermédiaire  | 18 modèles, relations complexes, migrations |
| Prisma ORM         | Intermédiaire+ | Schema, queries, migrations                 |
| Authentication     | Intermédiaire+ | JWT (jose), bcrypt, cookies, middleware     |
| Docker/Compose     | Intermédiaire  | Dockerfile multi-stage, services, volumes   |
| Git/GitHub         | Intermédiaire  | 13 issues, PRs, commits documentés          |
| Real-time          | Introductory   | SSE + Upstash Redis polling, statuts msgs   |

### Compétences Transversales

- **Communication** : Dossier de certification clair, diagrammes, preuve d'exécution.
- **Résolution de problèmes** : Auth middleware, modélisation Prisma, déploiement Docker.
- **Apprentissage autonome** : Documentation officielle, essais/erreurs, ajustements techniques.
- **Travail en équipe** : Collaboration GitHub, coordination sur issues communes.

---

## Améliorations Futures

### Court Terme

- Finaliser des tests d'intégration plus représentatifs.
- Mesurer les performances réelles de la home, du feed et du chat.
- Ajouter une page de monitoring minimaliste pour les erreurs critiques.

### Moyen Terme

- Ajouter des notifications push natives.
- Renforcer la modération et les signalements.
- Introduire des recommandations de contenu plus fines.

### Long Terme

- Séparer certains domaines en services indépendants si la charge augmente.
- Ajouter de l'analyse d'usage et des métriques produit.
- Préparer une version mobile dédiée si le besoin utilisateur le justifie.

---

## Métriques du Projet

| Indicateur               | Valeur                 |
| ------------------------ | ---------------------- |
| Modèles de données       | 18                     |
| Endpoints API documentés | 20+                    |
| Pages principales        | 12+                    |
| User stories             | 43                     |
| Événements temps réel    | 4 familles principales |
| Composants React         | 110+                   |
| Hooks personnalisés      | 30+                    |
| Variables CSS thème      | 200+                   |

Ces métriques servent à montrer que le projet est suffisamment complet pour mon examen de certification.

---

## Conclusion

Ce projet m'a permis de concevoir et documenter une application full-stack réaliste, avec des choix techniques justifiés et une architecture exploitable en production.

Pour le jury, l'essentiel est démontré: besoin métier compris, conception structurée, implémentation cohérente, capacité à aller jusqu'au déploiement, et recul sur les limites du projet.
