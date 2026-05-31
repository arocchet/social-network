# Speech par slide — Soutenance CDA RNCP 37873
## Christophe Lecart · 2 juin 2026

> **Comment utiliser ce document :** Chaque slide a un speech court à dérouler naturellement. Ne récite pas — comprends la logique et parle avec tes propres mots.

---

## Slide 1 — Page de titre

> "Bonjour. Je m'appelle Christophe Lecart, je suis candidat au titre Concepteur Développeur d'Applications, RNCP 37873, promotion 2024-2026 à Zone01 Rouen Normandie. Le projet que je vais vous présenter s'appelle Konekt — c'est une plateforme sociale full-stack temps réel, construite avec Next.js 15, Prisma et PostgreSQL."

---

## Slide 2 — Sommaire

> "La présentation s'articule en six parties : mon parcours et le contexte, le projet Konekt, la conception et la modélisation, l'architecture et le développement, la qualité et le déploiement, et enfin le bilan RNCP."

---

## Slide 3 — Le candidat

> "Je viens d'un background industriel — vingt ans de terrain en tant que technicien, d'abord chez KONE Ascenseurs puis chez SOCOTEC. En 2024, j'ai décidé de me reconvertir complètement vers le développement full-stack. Cette expérience industrielle m'a apporté une rigueur et une méthode que j'applique directement dans le code : on ne livre pas quelque chose qui ne fonctionne pas."

---

## Slide 4 — Parcours chronologique

> "Voici la chronologie. BAC PRO, BTS en automatismes industriels, puis vingt ans sur le terrain. La reconversion commence en 2024 avec Zone01 — une formation par projets, sans cours magistraux, où on apprend en faisant. C'est exactement ce dont j'avais besoin."

---

## Slide 5 — Méthode Agile

> "On a travaillé en mode agile. Le backlog est géré avec des user stories priorisées HIGH/MED/LOW. Chaque phase commence par une planification sur GitHub — issues assignées, points estimés — et se termine par une review. Les daily standups nous permettaient de synchroniser malgré les contraintes d'emploi du temps de l'équipe."

---

## Slide 6 — Workflow Git

> "Le workflow Git est structuré : personne ne pousse directement sur main. Tout passe par une Pull Request. On avait cinq contributeurs, plus de douze issues majeures. La PR numéro 118 est particulièrement représentative — c'est la stabilisation complète Docker, Neon, Prisma et Redis en une seule PR."

---

## Slide 7 — Anatomie d'une Pull Request

> "Voici la PR numéro 73, que j'ai ouverte. Elle fusionne dix commits dans main depuis ma branche feature. On voit les commits en conventional commits — feat, fix, docs — ce qui permet de générer un changelog automatique et de comprendre l'historique en un coup d'œil."

---

## Slide 8 — Le projet Konekt

> "La problématique est simple : concevoir une application sociale moderne, sécurisée, avec du temps réel. C'est le projet Social Network de Zone01 — on l'a baptisé Konekt. L'objectif est de démontrer la maîtrise de l'ensemble du cycle : conception, développement, tests, déploiement."

---

## Slide 9 — Cahier des charges

> "Le périmètre est conséquent : 38 user stories, 16 pages principales, 18 modèles de données, 60+ endpoints API. Pour vous donner une idée de la priorité — s'inscrire, se connecter, publier un post, réagir — ce sont les fonctionnalités critiques qui ont été livrées en premier."

---

## Slide 10 — Architecture multicouche

> "L'architecture est en couches. La couche présentation — ce que l'utilisateur voit — c'est React avec les Server Components de Next.js. La couche métier — les règles de gestion — c'est nos API Routes. La couche données — c'est Prisma avec PostgreSQL. Chaque couche a une responsabilité unique."

---

## Slide 11 — Stack technique

> "Côté frontend : Next.js 15 avec l'App Router, React 19, TypeScript strict, Tailwind CSS. Côté backend : les Route Handlers de Next.js, Prisma comme ORM, PostgreSQL hébergé sur Neon. Pour le temps réel : Server-Sent Events et Upstash Redis. Pour l'auth : jose pour le JWT, bcrypt pour les mots de passe."

---

## Slide 12 — Architecture système

> "Voici l'architecture système complète. Le navigateur communique avec Vercel en edge. Vercel route vers nos handlers Next.js — le middleware JWT intercepte toutes les requêtes vers /api/private. Les handlers interrogent Prisma qui parle à PostgreSQL sur Neon. Pour le temps réel, on passe par Upstash Redis."

---

## Slide 13 — Concepts de modélisation

> "Avant d'entrer dans le MCD, quelques rappels de vocabulaire. Une entité c'est un objet métier — User, Post, Comment. Un attribut c'est une caractéristique — email, createdAt. Une relation lie deux entités. Une cardinalité dit combien d'occurrences d'une entité peuvent être liées à une autre."

---

## Slide 14 — MCD

> "Le Modèle Conceptuel de Données — c'est la vue business, indépendante de toute technologie. On identifie les entités, leurs relations, et les cardinalités. Par exemple : un User publie plusieurs Posts — cardinalité 1,N. Un Post peut recevoir plusieurs Reactions — cardinalité 1,N. La relation User-Conversation est many-to-many via ConversationMember."

---

## Slide 15 — MLD

> "Le Modèle Logique de Données traduit le MCD en schéma relationnel. On matérialise les relations par des clés étrangères — Post.authorId référence User.id. On précise les contraintes : NOT NULL, UNIQUE. C'est le pont entre la conception abstraite et l'implémentation SQL."

---

## Slide 16 — MPD

> "Le Modèle Physique de Données c'est l'implémentation SQL concrète pour PostgreSQL. On choisit les types techniques — VARCHAR(255), TIMESTAMP, BOOLEAN, CHAR(25) pour les IDs CUID. On définit les index, les contraintes CHECK et les comportements ON DELETE — dans notre cas, CASCADE sur les relations User."

---

## Slide 17 — MCD 10 entités

> "Notre MCD compte 18 modèles Prisma, 40+ relations et 7 enums métier. Les entités centrales : User, Post, Comment, Reaction, Story, Conversation, Message, Group, Event, Notification. Chaque modèle correspond à une table PostgreSQL."

---

## Slide 18 — User au cœur du domaine

> "User est l'entité centrale. Tout gravite autour de lui : il publie des Posts, écrit des Comments, envoie des Messages, rejoint des Groups, organise des Events, reçoit des Notifications. Ce diagramme illustre la richesse du modèle — 18 entités, toutes reliées à User directement ou indirectement."

---

## Slide 19 — Design system

> "Le design system Konekt est construit sur une palette dark avec du rose comme couleur primaire. La typographie utilise Geist via next/font — optimisée et sans layout shift. On a plus de 200 variables CSS pour le thème, ce qui permet un dark mode natif cohérent sur tous les composants."

---

## Slide 20 — Wireframe Login

> "La page de connexion — version wireframe. On voit la structure : formulaire email/password, bouton OAuth Google, lien d'inscription. La validation est côté client via Zod — on vérifie le format avant même d'appeler l'API. Côté serveur, on retourne le même message d'erreur que l'email existe ou non — anti-énumération."

---

## Slide 21 — Maquette Login

> "Voici la version finale — maquette haute fidélité. Le design reprend la palette Konekt, le formulaire est épuré, le bouton Google est bien visible. Ce que vous voyez ici est exactement ce qui est déployé en production."

---

## Slide 22 — Wireframe Home Feed

> "Le wireframe du feed principal. En haut les stories, en dessous le fil de posts avec pagination offset — skip/take sur Prisma. La sidebar droite avec les suggestions de profils. L'infinite scroll est géré côté client."

---

## Slide 23 — Maquette Home Feed

> "La version finale du feed. Les posts s'affichent avec l'avatar de l'auteur, le contenu, les 7 types de réactions, le compteur de commentaires. Tout est chargé en une seule requête Prisma avec include — on évite le problème N+1."

---

## Slide 24 — Wireframe Profil

> "Le wireframe du profil utilisateur. Visibilité PUBLIC ou PRIVATE selon le paramètre ProfileVisibility. Compteurs followers, following, posts. L'action Suivre ou Modifier selon si c'est ton propre profil ou celui d'un autre."

---

## Slide 25 — Maquette Profil

> "La version finale du profil. La bannière personnalisable, l'avatar, les tabs Posts/Photos/Vidéos. Si le profil est PRIVATE, seuls les amis peuvent voir le contenu — le middleware vérifie ça avant de retourner les données."

---

## Slide 26 — Wireframe Création de post

> "Le wireframe de création de post. Composer riche avec upload d'image, choix de visibilité PUBLIC/FRIENDS/PRIVATE, validation Zod côté serveur. L'image est uploadée sur Cloudinary, l'URL est stockée en base."

---

## Slide 27 — Maquette Création de post

> "La version finale. L'interface de composition avec preview de l'image, sélecteur de visibilité, bouton de publication. Tout est validé côté serveur avant persistance — on ne fait pas confiance au client."

---

## Slide 28 — Wireframe Story Viewer

> "Le wireframe du story viewer. Plein écran, progression segmentée, navigation swipe. Les stories expirent automatiquement à 24h — un champ expiresAt en base, filtré dans les requêtes."

---

## Slide 29 — Maquette Story Viewer

> "La version finale. Le lecteur de stories avec la barre de progression, les contrôles de navigation. Le nombre de vues est persisté pour l'auteur via un modèle StoryView."

---

## Slide 30 — Wireframe Paramètres

> "Le wireframe des paramètres. Page centralisée — profil, sécurité, notifications, langue, thème, confidentialité. Toutes les préférences sont stockées dans un modèle UserSettings en relation 1-to-1 avec User."

---

## Slide 31 — Maquette Paramètres

> "La version finale des paramètres. Interface épurée, sections bien séparées. Le thème dark/light est switché en temps réel sans rechargement de page."

---

## Slide 32 — 14 routes implémentées

> "Voici les 14 pages principales. Du feed au chat, en passant par le profil, les groupes, les événements, les notifications et les paramètres. Chaque route correspond à une page Next.js dans le dossier app — convention App Router."

---

## Slide 33 — Diagramme de séquence Auth

> "Ce diagramme montre le flux complet d'authentification. L'utilisateur envoie email et password. Le serveur cherche l'utilisateur en base via Prisma. Si trouvé, bcrypt compare le hash. Si correct, jose génère un JWT signé HS256 avec expiration à 480 minutes. Le token est placé dans un cookie httpOnly — invisible du JavaScript."

---

## Slide 34 — Diagramme SSE

> "Voici le flux du temps réel. Client A envoie un message via POST /chat/send. Le message est persisté en base via Prisma. La clé Redis latest:chat:{from}:{to} est mise à jour. Client B, qui maintient une connexion SSE ouverte, poll cette clé toutes les 500ms. Quand la clé change, l'event est envoyé. Latence inférieure à une seconde."

---

## Slide 35 — Code Auth JWT

> "Voici l'extrait de code du login. On fait un findUnique Prisma sur l'email. Si l'utilisateur n'existe pas, on lève une erreur générique — pas de fuite d'information. Si le hash bcrypt ne correspond pas, même erreur. Si tout est valide, SignJWT de jose génère le token. Simple, lisible, sécurisé."

---

## Slide 36 — Schéma SSE Redis

> "Ce schéma illustre pourquoi on a choisi SSE plutôt que WebSocket. Vercel est serverless — chaque fonction démarre et se termine. Une connexion WebSocket persistante est incompatible. SSE utilise une requête HTTP longue durée compatible serverless. Redis sert de pont entre l'envoi et la réception."

---

## Slide 37 — Code SSE endpoint

> "Voici l'endpoint /chat/listen. Il vérifie le JWT, parse les paramètres, et lance une boucle de polling sur Redis toutes les 500ms. Quand request.signal est aborted — c'est-à-dire quand le client ferme la connexion — le polling s'arrête proprement. Pas de ressource orpheline côté serveur."

---

## Slide 38 — 60+ endpoints API

> "Voici l'ensemble des endpoints. Organisés en /api/public — login, register, OAuth — et /api/private — tout le reste, protégé par le middleware JWT. 63 fichiers route.ts au total. Chaque endpoint valide les entrées avec Zod et retourne une réponse standardisée."

---

## Slide 39 — Middleware Auth

> "Le middleware Next.js intercepte toutes les requêtes. Il identifie les routes publiques — /api/public, /login, /register. Pour tout le reste, il extrait le JWT du cookie, vérifie la signature avec jose, et injecte le userId dans les headers. Si le token est absent ou expiré — 401 ou redirection vers /login."

---

## Slide 40 — Sécurité & RGPD

> "Les mesures de sécurité en place : JWT signé HS256 avec cookies httpOnly et SameSite=Lax, bcrypt cost factor 12, validation Zod sur tous les payloads, OAuth avec state cookie anti-CSRF, Prisma qui paramétrise toutes les requêtes SQL, OWASP Top 10 audité. Côté RGPD : droit à l'oubli implémenté via DELETE /api/private/me avec suppression en cascade."

---

## Slide 41 — Requête SQL Prisma

> "Voici comment une requête traverse notre architecture. Le handler récupère le userId depuis les headers — injecté par le middleware. Il appelle Prisma avec un findUnique et un include pour les relations. Prisma génère le SQL paramétré. On ne manipule jamais de SQL brut — c'est Prisma qui s'en charge."

---

## Slide 42 — Injection SQL

> "Pour illustrer pourquoi nos requêtes sont sûres — voici ce qu'on ne fait PAS : concatener des strings pour construire du SQL. Une injection classique avec ' OR 1=1-- fonctionnerait sur une requête naïve. Avec Prisma, c'est impossible."

---

## Slide 43 — Défense en profondeur

> "On a trois couches de défense contre l'injection SQL. Zod valide le format en entrée — un email malformé est rejeté avant même d'atteindre la base. Prisma compose un SQL paramétré — jamais de concaténation. Le driver pg sépare le texte de la requête et les paramètres — PREPARE puis EXECUTE. Trois barrières indépendantes."

---

## Slide 44 — Stratégie de tests

> "Notre pyramide de tests : unitaires en bas — 5 tests Jest sur le composant Button avec React Testing Library. Tests d'intégration au milieu — 2 tests sur les routes auth register et login avec vraie base PostgreSQL. En haut, les tests E2E Playwright sont identifiés comme prochaine étape — 5 parcours critiques documentés, setup technique prêt."

---

## Slide 45 — Déploiement continu Vercel

> "Le pipeline de déploiement : push sur main déclenche automatiquement Vercel. Installation des dépendances avec bun, génération du client Prisma, lint, tests Jest, build Next.js, déploiement. Chaque PR génère aussi un environnement de preview — on peut tester le rendu réel avant de merger."

---

## Slide 46 — Du commit à la production

> "Le flux complet en quelques secondes. Git push main, Vercel intégration Git détecte le push, lint et tests passent, build next, déploiement edge runtime, URL de production live. Temps de déploiement autour de deux minutes."

---

## Slide 47 — Dockerfile multi-stage détail

> "Le Dockerfile multi-stage en deux étapes. Stage builder : image oven/bun, installation des dépendances, génération du client Prisma, build Next.js. Stage runner : image propre, on copie uniquement ce qui est nécessaire pour l'exécution — .next, node_modules, package.json, prisma. Image finale allégée, sans les outils de build."

---

## Slide 48 — Docker Compose deux profils

> "docker-compose avec deux profils. Profil dev : hot reload actif, volume monté, idéal pour le développement local. Profil prod : image multi-stage optimisée, comportement identique à la production. La base de données et Redis sont externes — Neon et Upstash — donc pas de service postgres ou redis dans compose."

---

## Slide 49 — Dockerfile applicatif

> "Voici le Dockerfile complet. Stage deps : cache des node_modules séparé pour accélérer les rebuilds. Stage builder : compilation complète. Stage runner : image minimale avec uniquement les artefacts de production. Les migrations Prisma sont appliquées automatiquement au démarrage du conteneur."

---

## Slide 50 — docker-compose.yml

> "Le fichier docker-compose. Le service app expose le port 3000, injecte les variables d'environnement depuis le fichier .env. On note que PostgreSQL et Redis ne sont pas des services locaux — ils viennent de Neon et Upstash. Les secrets ne sont jamais dans le code, uniquement dans les variables d'environnement."

---

## Slide 51 — Production Vercel + Neon + Upstash

> "L'infrastructure de production en trois couches. En local : docker-compose avec hot reload. En CI : build automatique sur push, lint et tests, URL de preview Vercel. En production : Vercel edge runtime, Neon PostgreSQL serverless, Upstash Redis serverless. Pas de serveur à maintenir."

---

## Slide 52 — Veille technique

> "La veille technique est structurée autour de quatre axes : documentation officielle, articles de praticiens comme Lee Robinson ou Josh Comeau, conférences comme React Conf 2024, et expérimentation directe sur des branches isolées. C'est cette veille qui m'a conduit à choisir SSE plutôt que WebSocket, et jose plutôt que jsonwebtoken."

---

## Slide 53 — Métriques du projet

> "Les chiffres du projet : 18 modèles Prisma, 60+ endpoints API, 12 pages principales, 38 user stories. 170 commits sur 376 au total — soit 45% du projet. Ces métriques montrent l'ampleur du travail et la densité des fonctionnalités livrées."

---

## Slide 54 — BC01 Développer une application sécurisée

> "Bloc de compétences 1 : développer une application sécurisée. Ce que ça couvre : maquetter, concevoir, développer, tester. Sur Konekt, ça se traduit par : maquettes Figma-like avec wireframes et mockups, authentification JWT + OAuth, validation Zod, middleware de protection, tests Jest unitaires et d'intégration, déploiement Docker et Vercel. Compétence validée."

---

## Slide 55 — BC02 Persistance des données

> "Bloc de compétences 2 : concevoir et développer la persistance des données. Ça couvre la modélisation relationnelle, les requêtes optimisées, l'intégrité. Sur Konekt : MCD/MLD/MPD avec Merise, 18 modèles Prisma, 40+ relations, contraintes d'unicité, migrations versionnées, requêtes avec include pour éviter le N+1. Compétence validée."

---

## Slide 56 — BC03 Application multicouche

> "Bloc de compétences 3 : concevoir et développer une application multicouche. Architecture Next.js avec séparation UI, API Routes, accès données. 110+ composants React, 30+ hooks personnalisés, 63 endpoints REST, temps réel SSE + Redis. Compétence validée."

---

## Slide 57 — BC03 Déploiement sécurisé

> "Le volet déploiement du BC03. Conteneurisation Docker multi-stage, déploiement continu Vercel, migrations Prisma automatisées, variables d'environnement sécurisées, analyse de code SonarQube. Compétence validée."

---

## Slide 58 — Difficultés rencontrées

> "La principale difficulté technique : le temps réel sans WebSocket persistant. Vercel serverless est incompatible avec des connexions TCP durables. J'ai construit un mécanisme SSE avec polling Redis qui reste compatible serverless tout en garantissant l'ordre des messages et la persistance Prisma. Ça m'a demandé de comprendre en profondeur les contraintes de l'environnement serverless."

---

## Slide 59 — Ce que j'ai appris

> "Les apprentissages clés : TypeScript strict bout en bout, Next.js App Router et Server Components, Prisma avec des modèles complexes, PostgreSQL avec des relations riches, Redis pour le temps réel. Et surtout — la collaboration en équipe distribuée via GitHub, sans jamais se retrouver en même temps."

---

## Slide 60 — Axes d'amélioration

> "Les axes d'amélioration identifiés. Court terme : étendre le rate limiting à /chat/send, ajouter Sentry pour le monitoring. Moyen terme : tests E2E Playwright sur les 5 parcours critiques, export JSON pour la portabilité RGPD. Long terme : séparer le chat en service dédié avec WebSocket si on quitte le serverless. Ce sont des axes de progression, pas des manques — la base est solide."

---

## Slide 61 — Conclusion

> "Konekt m'a permis de mettre en pratique l'ensemble du cycle de développement — de la modélisation à la mise en production. Au-delà de la certification, ce projet est la preuve concrète que ma reconversion est aboutie. Je suis capable de livrer une application complexe, sécurisée et documentée, de A à Z. La fiabilité compte plus que la sophistication — c'est la conviction que j'emporte."

---

## Slide 62 — Questions

> "Merci pour votre attention. Je suis disponible pour répondre à vos questions."

---

## TIPS pour l'oral

- **Parle lentement** — le jury a besoin de temps pour absorber
- **Regarde le jury** — pas les slides
- **Si tu ne sais pas** — dis "c'est une bonne question, je ne l'ai pas implémenté / je ne me souviens plus exactement" plutôt que d'inventer
- **Les slides techniques** (code) — pointe le code avec le doigt, explique ligne par ligne
- **Temps estimé par slide** — ~1min30 à 2min par slide pour 62 slides = ~90 minutes
