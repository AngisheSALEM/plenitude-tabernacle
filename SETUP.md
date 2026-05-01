# Initialisation de la base de données

L'application a rencontré une erreur car la table `users` n'existait pas dans la base de données. Cela arrive généralement lorsque les migrations n'ont pas encore été appliquées.

Pour résoudre ce problème, veuillez exécuter la commande suivante dans votre terminal Replit :

```bash
npx prisma migrate deploy
```

Cette commande appliquera toutes les migrations en attente à votre base de données sans supprimer de données existantes.

Si vous souhaitez réinitialiser complètement la base de données (attention : cela supprimera toutes les données), utilisez :

```bash
npx prisma migrate dev
```

Une fois la migration terminée, l'erreur `Table 'public.users' does not exist` devrait disparaître.

## Erreur de colonne manquante (ColumnNotFound)

Si vous rencontrez une erreur indiquant qu'une colonne n'existe pas (par exemple `The column evenements.imageUrl does not exist`), cela signifie que votre base de données n'est pas à jour avec le schéma Prisma.

Pour synchroniser votre base de données, assurez-vous d'abord que votre variable d'environnement `DATABASE_URL` est correctement configurée, puis exécutez :

```bash
npx prisma migrate deploy
```

Cela appliquera toutes les migrations manquantes, y compris celle ajoutant la colonne `imageUrl` à la table `evenements`.
