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
