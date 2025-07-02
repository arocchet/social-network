## TODO

### Revoir les schémas

* **Post & Comment** :
  Actuellement, les schémas ne sont pas cohérents ni bien organisés.
  Il faut repenser leur structure pour qu’ils reflètent précisément les données manipulées côté serveur et client.
  Penser modularité et réutilisabilité (ex. : schéma `Comment` indépendant, importé dans `Post`).

### Revoir les API

* Commencer par **l’API Commentaire** :

  * Valider les données en entrée (création, modification).
  * Harmoniser les réponses (schéma, gestion erreurs).
  * Gérer correctement les retours et les erreurs côté client.

* Ensuite, étendre la démarche aux autres API (Post, Reaction, Stories, User.).

* Revoir aussi la partie de User dans le /me notamment la partie Zod avec parseOrThrow

* Regarder les dates trouver un moyen de standardisé. Je pense au niveau du server avec Zod z.date().transform(d => d.toISOString())