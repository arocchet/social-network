# Stratégie de tests

## Objectif

Documenter la stratégie de tests retenue pour le projet Social Network, l'état actuel de la couverture, le plan d'extension et les jeux d'essai significatifs. Cette section répond à la **compétence 9 du RNCP 37873** : « Préparer et exécuter les plans de tests d'une application ».

L'approche est **honnête** : le projet a un test d'intégration backend fonctionnel (auth/register), une stratégie complète documentée, et un plan d'extension priorisé. Le reste est à implémenter — c'est assumé et listé.

---

## 1. Pyramide de tests visée

```
                  /\
                 /  \   E2E (Playwright) — 5-10 parcours critiques
                /----\
               /      \  Intégration API (Jest + Prisma test DB) — ~30 routes
              /--------\
             /          \  Unitaires UI (RTL) + utils — composants critiques
            /------------\
           /              \  Tests contractuels (schémas Zod) — gratuits
          /----------------\
```

**Principe :** beaucoup de tests rapides et ciblés en bas (unitaires + contractuels), un peu de tests d'intégration au milieu, peu de tests E2E lents en haut. Inspiré des pratiques OWASP et de la pyramide de Mike Cohn.

---

## 2. État actuel

### 2.1 Infrastructure de test en place

| Élément | Statut | Localisation |
|---|---|---|
| Framework de test |  | Jest 29 + `ts-jest` |
| Configuration |  | `jest.config.ts`, `jest.globalSetup.ts`, `jest.globalTeardown.ts` |
| Support ES modules |  | `node --experimental-vm-modules` dans le script `bun run test` |
| Mock Prisma |  | Connexion DB de test isolée |
| Test d'intégration auth/register |  | `__tests__/integrations/authentification.test.ts` |
| Tests unitaires UI |  | `__tests__/ui/button.test.tsx` — 5 tests RTL, 100% statements/lines |
| Tests E2E |  | À implémenter |
| Couverture chiffrée (`--coverage`) |  | Button : 100% stmts, 100% funcs, 100% lines, 50% branch (variant conditionnel) |
| CI : tests bloquants |  | Non configurés (pas de pipeline CI) — lint en `ignoreDuringBuilds: true` dans `next.config.ts` |

### 2.2 Test existant — extrait

`__tests__/integrations/authentification.test.ts` :

```typescript
import { POST } from '@/app/api/public/auth/register/route'
import { login } from '@/lib/server/user/login'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/security/hash';

beforeAll(async () => {
    await db.user.create({
        data: {
            username: 'testuser',
            email: 'test@example.com',
            password: await hashPassword('password123'),
            firstName: 'Test',
            lastName: 'User',
            birthDate: new Date('1990-01-01'),
        },
    });
});

describe('POST /api/register', () => {
    it('should register user and return success', async () => {
        // ... création FormData, appel POST, assertion status 200 + success: true
    })
});
```

Ce qui est couvert : création de compte avec données valides, vérification du status HTTP et de la forme de la réponse.

### 2.3 Lancer les tests

```bash
bun run test
# Sous le capot : node --experimental-vm-modules node_modules/.bin/jest
```

---

## 3. Plan d'extension (par priorité)

### Critique — à implémenter rapidement

#### 3.1 Tests d'intégration API sur les routes sensibles

Cibler les endpoints qui touchent à la sécurité ou à l'intégrité métier :

| Route | Scénarios à couvrir |
|---|---|
| `POST /api/public/auth/login` | identifiants corrects → JWT + cookie • identifiants incorrects → 401 • email malformé → 400 |
| `POST /api/public/auth/register` | inscription valide → 200 • email déjà pris → 400 • username déjà pris → 400 • password < 6 → 400 |
| `POST /api/public/auth/logout` | cookie supprimé après logout |
| `POST /api/private/post` | publication valide → 201 • non authentifié → 401 • payload invalide → 400 |
| `POST /api/private/chat/send` | envoi à un user privé non ami → 403 • payload valide → 200 |
| `PUT /api/private/reaction` | like d'un post → reaction créée • double like → conflit unique |
| `DELETE /api/private/reaction/[id]` | suppression réaction de l'auteur → OK • réaction d'autrui → 403 |
| `POST /api/private/friend-requests` | nouvelle demande → 201 • self-friend → 400 • demande existante → idempotent |
| `POST /api/private/groups/[id]/invite` | invitation par membre → OK • invitation par non-membre → 403 |
| `DELETE /api/private/events/[id]` | suppression par owner → OK • non-owner → 403 |

#### 3.2 Tests contractuels Zod

Vérifier que tous les schémas Zod rejettent bien les payloads malformés. Très rapide à écrire, couverture haute :

```typescript
describe('CredentialsLoginSchema', () => {
  it('rejette email invalide', () => {
    expect(() => CredentialsLoginSchema.parse({ email: 'invalid', password: 'azerty' })).toThrow();
  });
  it('rejette password trop court', () => {
    expect(() => CredentialsLoginSchema.parse({ email: 'a@b.c', password: '123' })).toThrow();
  });
  it('accepte payload valide', () => {
    expect(CredentialsLoginSchema.parse({ email: 'a@b.c', password: 'azerty' })).toBeDefined();
  });
});
```

### Important — sous 1 mois

#### 3.3 Tests unitaires UI (React Testing Library)

Composants prioritaires :

- `<LoginForm />` : validation côté client, gestion erreurs serveur, redirection après login
- `<PostCard />` : rendu du contenu (texte, image), comptage réactions, ouverture commentaires
- `<ReactionPopup />` : sélection d'une réaction (LIKE / LOVE / etc.), appel API, MAJ UI optimiste
- `<ChatMessage />` : rendu d'un message texte / image / lien, **statut de lecture (SENT/DELIVERED/READ)**, sanitization du markdown
- `<NotificationBadge />` : compteur de non-lus, mise à jour temps réel

#### 3.4 Tests E2E (Playwright)

Parcours critiques utilisateur :

1. **Inscription → onboarding → premier post → like → commentaire**
2. **Login → recherche d'un user → demande d'amitié → acceptation par l'autre user**
3. **Création de groupe → invitation → acceptation → message dans le groupe → reçu en temps réel**
4. **Création d'événement → RSVP par 2 users → modification de l'événement par l'owner**
5. **Déconnexion → tentative d'accès à `/feed` → redirection vers /login**

Playwright permet de mocker les services externes (Cloudinary, Google OAuth) en interceptant les requêtes.

### Bonus

#### 3.5 Tests de sécurité

- Injection SQL : tentative `' OR 1=1--` dans les champs login / search → doit échouer
- XSS : injection `<script>alert(1)</script>` dans un message de chat → ne doit pas s'exécuter (corrigé via `DOMPurify.sanitize()` dans `ChatMessage.tsx`)
- CSRF : tentative POST cross-site → cookie SameSite=Lax bloque
- Force brute login : 100 tentatives → doit déclencher rate limiting (implémenté — 5 req/60s/IP via `@upstash/ratelimit`, retourne 429)
- Privilege escalation : utilisateur A tente de modifier le profil de B → 403

#### 3.6 Tests de performance (Lighthouse)

Cibles à mesurer en production :

| Métrique | Cible Lighthouse |
|---|---|
| First Contentful Paint | < 1,8 s |
| Largest Contentful Paint | < 2,5 s |
| Total Blocking Time | < 200 ms |
| Cumulative Layout Shift | < 0,1 |
| Time to Interactive | < 3,8 s |

#### 3.7 Tests SSE / temps réel

Validation contractuelle du flux `text/event-stream` :

- Format `data: <JSON>\n\n`
- Reconnexion automatique côté client (`EventSource`)
- Fermeture propre côté serveur quand `request.signal.aborted`

---

## 4. Jeux d'essai documentés

Tableau récapitulatif des cas que les tests doivent couvrir, organisé par fonctionnalité.

### Authentification

| # | Composant | Entrée | Résultat attendu | Couvert |
|---|---|---|---|---|
| AU-01 | Login | email/password valides | 200 + cookie `authToken` + redirection feed |  partiel (register) |
| AU-02 | Login | password incorrect | 401, message générique « Invalid email or password » (pas de leak) |  |
| AU-03 | Login | email inexistant | 401 (même message, anti-énumération) |  |
| AU-04 | Register | données valides | 200 + utilisateur en DB + cookie |  |
| AU-05 | Register | email déjà pris | 400 + message clair |  |
| AU-06 | Register | password < 6 caractères | 400 (Zod) |  |
| AU-07 | Logout | cookie présent | 200 + cookie effacé |  |
| AU-08 | Middleware | requête sans `authToken` sur `/api/private/*` | 401 ou redirection `/login` |  |
| AU-09 | Middleware | requête avec `authToken` expiré | 401 + redirection |  |
| AU-10 | OAuth Google | redirect + callback avec `state` matchant | création/login user + cookie |  |
| AU-11 | OAuth Google | callback avec `state` non matchant | refus 401 (anti-CSRF) |  |

### Posts et interactions

| # | Composant | Entrée | Résultat attendu | Couvert |
|---|---|---|---|---|
| PO-01 | Créer post | texte + image | post visible immédiatement dans le feed |  |
| PO-02 | Créer post | non authentifié | 401 |  |
| PO-03 | Réagir | LIKE sur un post | reaction créée, compteur +1 |  |
| PO-04 | Réagir | LIKE deux fois sur le même post | contrainte unique → conflit ou idempotent |  |
| PO-05 | Commenter | texte | commentaire visible sous le post |  |

### Messagerie temps réel

| # | Composant | Entrée | Résultat attendu | Couvert |
|---|---|---|---|---|
| CH-01 | Envoyer DM | user A → user B (amis) | message persisté + clé Redis MAJ |  |
| CH-02 | Envoyer DM | user A → user B (B privé, pas amis) | 403 |  |
| CH-03 | Recevoir SSE | flux ouvert côté user B | nouveau message poussé < 2 s après envoi |  |
| CH-04 | Marquer comme lu | user B lit un message | `readAt` MAJ, status = READ |  |
| CH-05 | Typing indicator | A tape, B voit l'indicateur | indicateur affiché côté B |  |

### Groupes et événements

| # | Composant | Entrée | Résultat attendu | Couvert |
|---|---|---|---|---|
| GR-01 | Créer groupe | owner crée avec titre | groupe créé, owner = membre |  |
| GR-02 | Inviter membre | owner invite user X | invitation PENDING en DB |  |
| GR-03 | Accepter invitation | user X accepte | GroupMember créé, GroupInvitation = ACCEPTED |  |
| GR-04 | Quitter groupe | membre normal | GroupMember supprimé |  |
| GR-05 | Créer événement | owner d'un groupe | Event créé, lié au groupe |  |
| GR-06 | RSVP | user répond YES | Rsvp créé, contrainte unique respectée |  |

### Sécurité

| # | Composant | Entrée | Résultat attendu | Couvert |
|---|---|---|---|---|
| SE-01 | SQLi | `' OR 1=1--` dans login email | Zod rejette ou Prisma traite comme string |  |
| SE-02 | XSS | `<script>` dans message chat | échappé via DOMPurify.sanitize() dans ChatMessage.tsx |  |
| SE-03 | Path traversal | `..\..\` dans paramètres URL | ne donne pas accès à des ressources hors scope |  |
| SE-04 | Privilege escalation | user A appelle `PUT /api/private/me` pour user B | non possible (handlers utilisent `x-user-id`) |  |
| SE-05 | JWT tampering | modification du payload | `jwtVerify` échoue → redirection /login |  |

---

## 5. Outils et commandes

```bash
# Lancer tous les tests
bun run test

# Lancer un test spécifique
bun run test -- authentification

# Mode watch
bun run test -- --watch

# Couverture (à activer)
bun run test -- --coverage

# Démarrer la base de test
docker-compose up db -d

# Reset la base de test entre runs
bunx prisma migrate reset --skip-seed
```

---

## 6. Position pour la soutenance RNCP

**Ce que je peux démontrer pendant l'entretien technique :**

- Setup Jest + ts-jest fonctionnel avec `bun run test`
- Un test d'intégration backend qui passe (création utilisateur via la vraie route `/api/public/auth/register`)
- Cette stratégie de tests documentée
- Tableau exhaustif des jeux d'essai à couvrir

**Ce que j'assume comme limite :**

> « La couverture de tests actuelle est insuffisante pour une mise en production. La priorité, suite à cette certification, sera d'implémenter les tests d'intégration API sur les 10 routes critiques listées, puis les tests E2E Playwright sur les 5 parcours utilisateur clés. Le setup technique est déjà en place pour cette extension. »

---

## 7. Références

- [Jest documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright for Next.js](https://playwright.dev/docs/intro)
- [The Test Pyramid (Mike Cohn, Martin Fowler)](https://martinfowler.com/articles/practical-test-pyramid.html)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
