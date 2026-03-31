# Plenitude Tabernacle - Site de l'Église

Site web de l'église Plénitude Tabernacle de Kinshasa, développé en Next.js 16 avec Prisma ORM et NextAuth.

## Stack technique

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Base de données**: PostgreSQL (Replit) via Prisma 7 + adapter `@prisma/adapter-pg`
- **Authentification**: NextAuth v4 (email/password + Google OAuth)
- **ORM**: Prisma 7 (schéma dans `prisma/schema.prisma`, config dans `prisma.config.ts`)
- **UI**: Tailwind CSS v4, Radix UI, shadcn/ui, Framer Motion
- **Hachage**: bcryptjs

## Structure du projet

```
app/
  api/
    auth/[...nextauth]/  → NextAuth handler (sessions + cookies)
    inscription/         → POST /api/inscription (créer un compte)
    videos/              → GET/POST + [id] PATCH/DELETE
    audio/               → GET/POST + [id] PATCH/DELETE
    cantiques/           → GET/POST + [id] PATCH/DELETE
    evenements/          → GET/POST + [id] PATCH/DELETE
    profil/              → GET (profil complet) + PATCH (mise à jour)
    favoris/             → GET/POST/DELETE (gestion des favoris)
  admin/                 → Pages d'administration (videos, audio, cantiques, annonces)
  connexion/             → Page de connexion
  inscription/           → Page d'inscription
  profil/                → Page de profil membre
lib/
  prisma.ts              → Singleton Prisma (adapter pg)
  auth.ts                → Configuration NextAuth (JWT, Google, Credentials)
  cantiques-data.ts      → Données statiques des cantiques
prisma/
  schema.prisma          → Modèles: User, Video, Audio, Cantique, Evenement, Favorites
  migrations/            → Migrations SQL
types/
  next-auth.d.ts         → Extension des types de session NextAuth
```

## Modèles de base de données

| Modèle | Description |
|---|---|
| User | Membres avec rôle ADMIN ou MEMBRE |
| Video | Prédications vidéo (YouTube) |
| Audio | Prédications audio |
| Cantique | Recueil de cantiques (paroles JSON) |
| Evenement | Annonces/événements de l'église |
| FavoriteVideo/Audio/Cantique | Favoris par utilisateur |

## Routes API

### Authentification
- `POST /api/inscription` — Créer un compte (email + mot de passe)
- `POST /api/auth/signin` — Connexion (NextAuth)
- `GET/POST /api/auth/[...nextauth]` — Handler NextAuth (sessions, Google OAuth)

### Ressources (CRUD)
Toutes les routes GET sont publiques. POST/PATCH/DELETE nécessitent un rôle ADMIN.

- `/api/videos?category=&search=&featured=&page=&limit=`
- `/api/videos/[id]`
- `/api/audio?category=&search=&featured=&page=&limit=`
- `/api/audio/[id]`
- `/api/cantiques?category=&search=&page=&limit=`
- `/api/cantiques/[id]`
- `/api/evenements?active=&page=&limit=`
- `/api/evenements/[id]`

### Profil & Favoris (authentification requise)
- `GET/PATCH /api/profil`
- `GET/POST/DELETE /api/favoris?type=videos|audios|cantiques`

## Configuration des variables d'environnement

| Variable | Description | Où la définir |
|---|---|---|
| DATABASE_URL | URL PostgreSQL Replit | Auto (Replit) |
| NEXTAUTH_SECRET | Clé secrète sessions | Défini automatiquement |
| NEXTAUTH_URL | URL de l'app | `http://localhost:5000` |
| GOOGLE_CLIENT_ID | OAuth Google | Secrets Replit |
| GOOGLE_CLIENT_SECRET | OAuth Google | Secrets Replit |

## Gestion des cookies / sessions

- Stratégie JWT (token stocké dans cookie `plenitude-session`)
- Durée : 30 jours
- `rememberMe` : géré automatiquement par la durée du JWT
- Cookie sécurisé (httpOnly, sameSite: lax) 

## Commandes utiles

```bash
npx prisma migrate dev --name <nom>   # Nouvelle migration
npx prisma generate                   # Régénérer le client
npx prisma studio                     # Interface de la base de données
```

## Serveur de développement

Port : **5000** (`npm run dev`)
