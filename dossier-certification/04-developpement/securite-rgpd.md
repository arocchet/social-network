# Sécurité et conformité RGPD

## Objectif

Cette section répond directement à l'intitulé des **3 blocs RNCP 37873** qui parlent tous d'« application **sécurisée** ». Elle décrit :

1. les mesures de sécurité **réellement implémentées** dans le code (avec références fichiers),
2. les **risques résiduels** identifiés et leur impact,
3. la **conformité RGPD** : ce qui est en place et ce qui reste à faire,
4. la **roadmap** de durcissement.

L'approche est volontairement honnête : tout ce qui est annoncé est vérifiable dans le dépôt ; tout ce qui manque est listé pour ne pas être pris en défaut en soutenance.

---

## 1. Authentification et sessions

### 1.1 JWT signé via `jose`

**Fichiers :** `src/lib/jwt/signJwt.ts`, `src/lib/jwt/verifyJwt.ts`, `src/config/auth.ts`

- Algorithme : **HS256** (HMAC SHA-256, secret symétrique).
- Secret : variable d'environnement `JWT_SECRET`, jamais committée (référencée dans `.env.example`).
- Payload minimal : `{ userId }` — on évite de mettre l'email ou des données personnelles dans le token.
- Expiration par défaut : **8 heures** (`JWT_EXPIRATION.DEFAULT = "480m"`). Constantes prédéfinies pour 10min, 1h, 1j, 7j, 30j.
- Vérification gérée dans le middleware Next.js et utilitaires serveur ; messages d'erreur normalisés (`Token expired`, `Invalid token`).

### 1.2 Hashage des mots de passe avec bcrypt

**Fichier :** `src/lib/security/hash.ts`

```typescript
import bcrypt from 'bcrypt'

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12)
}

export async function comparePasswords(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed)
}
```

- **Cost factor 12** (~250 ms par hash sur CPU moderne) — au-dessus du minimum OWASP (10), résistant aux attaques par force brute.
- Pas de stockage en clair, pas de stockage réversible.
- La comparaison utilise `bcrypt.compare` (résistant au timing attack).

### 1.3 Cookies HTTP-only

**Fichiers :** `src/app/api/public/auth/login/route.ts`, `register/route.ts`, `logout/route.ts`, `callback/google/route.ts`

Tous les cookies d'authentification respectent les flags :

| Flag | Valeur | Effet |
|---|---|---|
| `httpOnly` | `true` | Inaccessible en JavaScript côté client → mitige les attaques XSS |
| `secure` | `true` en production | Cookie transmis uniquement via HTTPS |
| `sameSite` | `lax` | Bloque l'envoi du cookie sur les requêtes cross-site → mitige CSRF |
| `maxAge` | 7 jours (login), 8 h (register, OAuth) | Expiration cohérente avec le JWT |

### 1.4 Middleware d'autorisation par défaut

**Fichier :** `src/middleware.ts`

Le middleware **protège tout par défaut** (matcher `'/((?!_next/static|_next/image|favicon.ico).*)'`) et fait passer uniquement :

- les routes publiques explicites (`/login`, `/register`, `/palette`),
- toutes les routes sous `/api/public/...`,
- les fichiers statiques (extensions images).

Pour les routes protégées, il vérifie le cookie `authToken` via `verifyJwt`, redirige vers `/login` si invalide, et **injecte un header `x-user-id`** dans la requête downstream. Les routes API consomment cet identifiant via `getUserIdFromRequest`.

C'est une approche **deny-by-default** : un développeur qui crée une nouvelle route ne risque pas d'oublier de la protéger.

### 1.5 OAuth Google : protection CSRF par `state`

**Fichiers :** `src/app/api/public/auth/redirect/google/route.ts` et `callback/google/route.ts`

Le flux OAuth Google génère un `state` aléatoire stocké côté serveur dans un cookie `oauth_state` (httpOnly), comparé à celui retourné par Google au callback. Empêche les attaques CSRF classiques sur OAuth (un attaquant ne peut pas forcer la connexion d'une victime sur son propre compte Google).

---

## 2. Protection contre les attaques classiques

### 2.1 Injection SQL — Prisma

**Mitigation :** **Prisma 6** est utilisé pour 100 % des accès base de données. Toutes les requêtes passent par des appels paramétrés (`db.user.findUnique({ where: { email } })`). **Aucune concaténation SQL n'est faite dans le code applicatif** (vérifié par grep : aucun appel `$queryRaw` ou `$executeRaw`).

### 2.2 Cross-Site Scripting (XSS) — React + audit `dangerouslySetInnerHTML`

**Mitigation par défaut :** React échappe automatiquement le contenu inséré via `{variable}`. Pas de risque XSS sur le rendu standard.

**Risque résiduel identifié :** deux usages de `dangerouslySetInnerHTML` détectés dans le code :

1. `src/components/ui/chart.tsx` — injection de CSS dynamique de Recharts, **safe** (pas d'input utilisateur).
2. `src/components/chat/ChatMessage.tsx` ligne 134 — transforme `**texte**` en `<strong>texte</strong>` dans les messages de chat via un `replace` markdown :

```tsx
const content = part.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
return <div dangerouslySetInnerHTML={{ __html: content }} />;
```

**Impact :** un message de chat contenant du HTML brut (`<script>alert(1)</script>`) serait injecté dans le DOM. **C'est une vulnérabilité réelle** à corriger avant production. Voir section [Roadmap de durcissement](#5-roadmap-de-durcissement).

### 2.3 Cross-Site Request Forgery (CSRF)

- Cookie d'auth en `SameSite=Lax` → bloque l'envoi automatique du cookie sur les requêtes cross-site dangereuses (POST depuis un site tiers).
- OAuth Google protégé par `state` (voir 1.5).
- **Pas de token CSRF additionnel** sur les mutations POST/PUT/DELETE — acceptable dans le contexte SameSite=Lax pour la plupart des cas, mais une protection en profondeur (double-submit cookie ou jeton signé) serait souhaitable.

### 2.4 Validation des entrées — Zod

**Fichiers :** `src/lib/schemas/` (36 schémas)

Les payloads d'API sont validés via Zod avant tout traitement métier. Exemples :

- `CredentialsLoginSchema` : `email().email()` + `password.min(6)`
- `RegisterUserInputSchema` : email validé, password min 6 caractères, contrôle source (`credentials` / `google` / `discord`), `superRefine` pour cohérence métier (par exemple `tokens` obligatoires si OAuth).
- Schémas dédiés pour posts, commentaires, reactions, groupes, événements, etc.

**Faiblesse identifiée :** la longueur minimale de mot de passe est **6 caractères** (`z.string().min(6)`). C'est en-dessous des recommandations OWASP (8 minimum, idéalement 12). À renforcer : voir [Roadmap](#5-roadmap-de-durcissement).

### 2.5 Headers HTTP de sécurité

**Statut actuel :** aucun header de sécurité custom n'est configuré dans `next.config.ts` :

```typescript
// next.config.ts — pas de section "headers"
```

**Headers manquants :**

| Header | Effet | Statut |
|---|---|---|
| `Strict-Transport-Security` | Force HTTPS pour toutes les requêtes futures |  (Vercel le fournit par défaut côté edge) |
| `Content-Security-Policy` | Limite les sources de scripts / styles → mitige XSS |  |
| `X-Frame-Options` ou `frame-ancestors` | Empêche le clickjacking via iframe |  |
| `X-Content-Type-Options: nosniff` | Empêche le MIME-sniffing |  |
| `Referrer-Policy` | Contrôle l'info Referer envoyée aux tiers |  |
| `Permissions-Policy` | Limite l'accès aux APIs navigateur (caméra, micro, etc.) |  |

Ces headers sont triviaux à ajouter via la clé `headers` de `next.config.ts`. Inscrit en roadmap.

### 2.6 Rate limiting

**Statut actuel :** rate limiting applicatif **implémenté** sur `/api/public/auth/login` et `/api/public/auth/register` via `@upstash/ratelimit` (sliding window — 5 tentatives par IP par fenêtre de 60 secondes). La logique est centralisée dans `src/lib/security/ratelimit.ts` et fail-open en local si Redis n'est pas configuré.

**Risque résiduel :** les endpoints d'envoi (chat, posts) ne sont pas encore rate-limités — attaque par spam possible.

**Roadmap :** étendre le rate limiting à `/api/private/chat/send` et aux endpoints de création de contenu.

---

## 3. Upload de fichiers (avatars, posts, stories)

**Stack :** upload côté serveur via Next.js → service `CloudinaryService` (`src/lib/cloudinary/cloudinary.ts`) → Cloudinary.

**Sécurité actuelle :**

- Les credentials Cloudinary (`API_KEY`, `API_SECRET`) restent côté serveur (jamais exposés au client).
- Cloudinary applique ses propres restrictions de format (`resource_type: 'image'` ou `'video'`).
- Les images sont servies via le CDN sécurisé Cloudinary (`secure: true`).
- Les domaines images autorisés sont **whitelisted** dans `next.config.ts` (`images.domains`) — empêche l'usage de domaines arbitraires via `<Image>`.

**Risques résiduels :**

- **Pas de validation MIME côté serveur** avant envoi à Cloudinary : un attaquant pourrait tenter d'uploader un fichier malformé.
- **Pas de limite de taille** explicitement vérifiée côté API route.
- Cloudinary nettoie les EXIF des images uploadées (privacy bonus).

---

## 4. Conformité RGPD

### 4.1 Données personnelles collectées

D'après `prisma/schema.prisma`, le projet collecte :

| Données | Caractère | Justification |
|---|---|---|
| Email | Identifiant principal | Authentification, notifications |
| `firstName`, `lastName` | Optionnels | Affichage profil |
| `birthDate` | Optionnel | Affichage / vérification d'âge (mais pas appliqué — voir 4.4) |
| `username` | Optionnel | Identifiant public |
| `biography` | Optionnel | Présentation personnelle |
| `avatar`, `banner` | Optionnels | Personnalisation profil |
| `password` (hashé) | Authentification credentials | bcrypt cost 12 |
| `Account` (OAuth) — tokens Google | Pour les comptes OAuth | Permet rafraîchissement futur |
| Posts, commentaires, réactions, messages | Contenu utilisateur | Cœur du service |

### 4.2 Principe de minimisation —  respecté

Tous les champs sauf `email` sont **optionnels** dans le schéma Prisma. L'inscription ne demande que le strict nécessaire ; les autres champs sont enrichis ultérieurement via l'onboarding.

### 4.3 Droits RGPD de la personne concernée

| Droit RGPD (art. 15-22) | Statut |
|---|---|
| **Droit d'accès** (consulter ses données) |  Partiellement : `GET /api/private/me` retourne le profil mais pas l'intégralité (posts, messages…) |
| **Droit de rectification** |  `PUT /api/private/me` + `PATCH /api/private/user/settings` |
| **Droit à l'effacement / oubli** |  **Endpoint de suppression de compte non implémenté** |
| **Droit à la limitation du traitement** |  Indirect via `visibility: PRIVATE` mais non normalisé |
| **Droit à la portabilité** |  **Pas d'export structuré (JSON/CSV) des données utilisateur** |
| **Droit d'opposition** |  Notifications désactivables via `notificationsEnabled` |
| **Décision automatisée / profilage** |  N/A (pas d'algorithme de recommandation automatisé) |

**Points critiques à adresser pour une mise en production :** droit à l'oubli et droit à la portabilité. Ce sont des **obligations légales** dès qu'il y a des utilisateurs en UE.

### 4.4 Consentement et âge

- **Pas de bannière cookies** : acceptable dans l'état actuel car le seul cookie posé (`authToken`) est strictement fonctionnel/nécessaire (exempté de consentement par la CNIL). Le cookie `oauth_state` est aussi fonctionnel et éphémère.
- **Pas de vérification d'âge** : la date de naissance (`birthDate`) est demandée mais aucune logique n'empêche un mineur de moins de 15 ans (seuil RGPD en France) de créer un compte. À implémenter avant production.

### 4.5 Mentions légales et politique de confidentialité

 **Aucune page « Mentions légales » ni « Politique de confidentialité »** n'existe dans le projet. Ces pages sont **obligatoires** pour tout service en ligne accessible depuis l'UE. À créer.

### 4.6 Sécurité des données en transit et au repos

- **En transit :** HTTPS forcé côté Vercel (TLS automatique), connexions PostgreSQL et Redis chiffrées.
- **Au repos :**
  - PostgreSQL Neon : chiffrement disque par défaut, sauvegardes chiffrées.
  - Upstash Redis : chiffrement TLS sur les connexions REST.
  - Cloudinary : chiffrement transit + repos par défaut.
  - Mots de passe utilisateur : bcrypt cost 12 (irréversible).

### 4.7 Logs et durée de conservation

- **Logs applicatifs :** sortie console serveur (capturée par Vercel). Pas de log structuré ni d'archivage formel. **Aucune politique de durée de conservation définie.**
- **Pas d'anonymisation automatique** des comptes inactifs.

---

## 5. Roadmap de durcissement

Priorisé par impact / facilité d'implémentation.

### Critique — avant mise en production

| # | Action | Effort | Bénéfice |
|---|---|---|---|
| 1 | **Endpoint `DELETE /api/private/me`** : suppression de compte avec cascade sur les contenus | 1-2 j | Conformité RGPD art. 17 (droit à l'oubli) |
| 2 | **Endpoint `GET /api/private/me/export`** : export JSON de toutes les données utilisateur | 1-2 j | Conformité RGPD art. 20 (portabilité) |
| 3 | **Sanitization du chat** : `DOMPurify.sanitize()` implémenté sur `dangerouslySetInnerHTML` dans `ChatMessage.tsx` — ALLOWED_TAGS restreints | ✅ fait | Vulnérabilité XSS corrigée |
| 4 | **Headers de sécurité** dans `next.config.ts` (CSP, X-Frame-Options, Referrer-Policy, X-Content-Type-Options) | 0,5 j | Couvre clickjacking, MIME sniffing, fuite Referer |
| 5 | **Pages Mentions légales + Politique de confidentialité** | 0,5 j | Obligation légale UE |

### Important — sous 1 mois post-prod

| # | Action | Effort | Bénéfice |
|---|---|---|---|
| 6 | **Rate limiting** sur `/chat/send` et endpoints de création de contenu via `@upstash/ratelimit` (déjà en place sur `/login` et `/register`) | 0,5 j | Anti-spam |
| 7 | **Vérification email** à l'inscription (token signé envoyé par mail) | 1-2 j | Anti-bot, conformité |
| 8 | **Politique mots de passe** : min 8 caractères, exigence complexité (chiffre + symbole optionnel), check contre HaveIBeenPwned API | 0,5 j | Conformité OWASP |
| 9 | **Validation MIME / taille upload** côté serveur avant Cloudinary | 0,5 j | Anti-abus stockage |
| 10 | **Refresh tokens** + rotation, révocation en cas de logout | 2 j | Sécurité session avancée |

### Bonus — confort exploitation

| # | Action | Effort | Bénéfice |
|---|---|---|---|
| 11 | **Vérification d'âge** (≥ 15 ans selon CNIL France) au moment de l'inscription | 0,5 j | Conformité RGPD France |
| 12 | **Sentry** (déjà documenté dans `05-deploiement`) pour le suivi des erreurs et incidents | 0,5 j | Réactivité incident |
| 13 | **Logs structurés** (`pino`) avec niveaux et redaction des données sensibles | 1 j | Audit, exploitation |
| 14 | **Politique de durée de conservation** documentée + job de nettoyage des comptes inactifs > 3 ans | 1 j | Conformité RGPD art. 5.1.e |
| 15 | **CSRF token additionnel** (double-submit cookie) pour les mutations sensibles | 1 j | Défense en profondeur |

---

## 6. Synthèse pour le jury RNCP

**Ce qui est solide et démontrable :**

- Authentification stateless robuste (JWT HS256 via `jose`, secret en env, bcrypt cost 12, cookies httpOnly+secure+sameSite=lax).
- Middleware deny-by-default qui force l'auth sur toutes les routes non `/public/`.
- OAuth Google avec `state` cookie pour prévenir CSRF.
- Validation Zod systématique des payloads (36 schémas).
- SQLi écartée structurellement par Prisma.
- Données personnelles minimisées (1 seul champ obligatoire à l'inscription : l'email).
- Chiffrement en transit (TLS) et au repos (Neon, Cloudinary).

**Ce que j'assume avec honnêteté :**

- Rate limiting en place sur `/login` et `/register` (5 req/60s/IP via `@upstash/ratelimit`) — pas encore étendu à `/chat/send` et aux endpoints de création.
- Pas de headers de sécurité personnalisés → à ajouter en 30 min dans `next.config.ts`.
- XSS dans `ChatMessage.tsx` corrigée via `DOMPurify.sanitize()` — ALLOWED_TAGS: `['strong', 'em', 'br']`, ALLOWED_ATTR: `[]`.
- Droit à l'oubli et droit à la portabilité RGPD non implémentés → bloquant pour une mise en prod réelle, listé en priorité critique.
- Pas de page mentions légales / privacy → obligatoire UE, à rédiger.

**Ce que je présente comme axe de progression :**

Le projet est un **socle réaliste** sur lequel construire. Les choix structurels (JWT stateless, Prisma, Zod, middleware deny-by-default) facilitent toutes les améliorations listées en roadmap. Les éléments manquants sont identifiés, priorisés et chiffrés en effort.

---

## 7. Références

- [OWASP Top 10 — 2021](https://owasp.org/Top10/)
- [CNIL — Délibération sur les cookies et autres traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs)
- [CNIL — Sécurité des données personnelles](https://www.cnil.fr/sites/cnil/files/atoms/files/guide_securite-vd.pdf)
- [RGPD texte officiel — art. 5, 15-22, 25, 32](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [Mozilla — Security headers checklist](https://infosec.mozilla.org/guidelines/web_security)
