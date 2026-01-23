# PROJET TASTE FEDERATION

Étudiants : Nassim Assiaoui, Amaury Franssen.

Ce projet se compose de trois parties :
- Front web (PWA) : dossier `front`
- API backend (NestJS) : dossier `back`
- Application mobile (React Native) : dossier `mobile`

Consultez le PDF du projet pour le détail des parcours.

## Prérequis
- Docker et Docker Compose
- Node.js + pnpm
- (Optionnel) Environnement React Native pour `mobile`

## Démarrer en local

### 1) Base de données (Docker)
Dans `/back`, lancez Postgres :
```
docker compose up -d
```

### 2) API (NestJS)
Dans `/back` :
```
pnpm install
pnpm run start:dev
```
L’API démarre sur `http://localhost:3000`.

### 3) Front (Next.js)
Dans `/front` :
```
pnpm install
pnpm run dev
```
Le front démarre sur `http://localhost:3001`.

### 4) Seeding (optionnel)
Dans `/back` :
```
pnpm run seed
```

## Structure
- `front/` : application web (PWA)
- `back/` : API NestJS + base de données
- `mobile/` : app mobile (suivi des commandes)