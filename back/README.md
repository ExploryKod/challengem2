# Documentation Backend

## Présentation

### But
- API backend pour les opérations de réservation et d’administration.

### Technologies
- NestJS, TypeORM, PostgreSQL.

## Démarrage local

### Base de données (Docker)
- Dans `/back` : `docker compose up -d`

### API
- Dans `/back` :
  - `pnpm install`
  - `pnpm run start:dev`
  - URL : `http://localhost:3000`

## Tests
- `pnpm run test`
- `pnpm run test:watch`
- `pnpm run test:cov`
- `pnpm run test:e2e`

## Architecture
- Clean Architecture / DDD (modules séparés : ordering, admin)
- Ports et cas d’usage en application, implémentations en infrastructure

## Arborescence
- `back/src/app.module.ts`
- `back/src/main.ts`
- `back/src/modules/ordering/` (API publique)
- `back/src/modules/admin/` (API admin)
- `back/src/shared/database/` (configuration DB)
- `back/src/seeds/` (seed de données)

## Variables d’environnement
- En local : `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- En production (Render + Supabase) : `SUPABASE_DATABASE_URL`

## Seed (optionnel)
- `pnpm run seed`

## Routes API

### Public
- `GET /restaurants`
- `GET /tables?restaurantId={number}`
- `GET /meals?restaurantId={number}&type={MealType?}`
- `GET /reservations`
- `GET /reservations/:id`
- `POST /reservations`

### Admin
- `GET /admin/restaurants`
- `GET /admin/restaurants/:id`
- `POST /admin/restaurants`
- `PUT /admin/restaurants/:id`
- `DELETE /admin/restaurants/:id`
- `GET /admin/tables?restaurantId={number}`
- `GET /admin/tables/:id`
- `POST /admin/tables`
- `PUT /admin/tables/:id`
- `DELETE /admin/tables/:id`
- `GET /admin/meals?restaurantId={number}`
- `GET /admin/meals/:id`
- `POST /admin/meals`
- `PUT /admin/meals/:id`
- `DELETE /admin/meals/:id`
- `GET /admin/reservations?restaurantId={number}`
- `GET /admin/reservations/:id`
- `POST /admin/reservations`
- `PUT /admin/reservations/:id`
- `DELETE /admin/reservations/:id`

## Déploiement (Render)
- Root : `back`
- Build : `pnpm install && pnpm run build`
- Start : `pnpm run start:prod`
