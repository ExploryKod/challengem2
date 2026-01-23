# Documentation Frontend

## Présentation

### But
- Application web (PWA) pour la réservation et l’administration.

### Technologies
- Next.js, Tailwind, Redux.

## Démarrage local
- `pnpm install`
- `pnpm run dev`
- URL : `http://localhost:3001`

## Variables d’environnement
- `NEXT_PUBLIC_API_URL`
- `BETTER_AUTH_DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Auth (Better Auth)
- Schéma SQL : `better-auth_migrations/adminer.sql`
- Seed admin : `pnpm run seed:auth`

## Déploiement (Vercel)
- Root : `front`
- Build : `pnpm run build`
- Env vars : voir section Variables d’environnement
