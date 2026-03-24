# Taste Federation

Application de réservation de restaurant avec commande de repas en ligne.

**Étudiants** : Nassim Assiaoui, Amaury Franssen

## Fonctionnalités

- **Réservation en ligne** : Parcours client pour réserver une table et pré-commander des repas
- **Mode QR Code** : Scan d'un QR code à table pour commander directement
- **Terminal d'accueil** : Borne pour identifier les clients avec leur code de réservation
- **Backoffice admin** : Gestion des restaurants, tables, menus et réservations
- **Kitchen Display** : Application mobile pour le suivi des commandes en cuisine
- **Mode démo (portfolio)** : Deux restaurants d'exemple toujours disponibles sur le front, même sans API

## Architecture

```
├── front/          # Application web Next.js (PWA)
├── back/           # API NestJS + PostgreSQL
├── mobile/         # Application Expo (Kitchen Display)
├── docs/           # Documentation et plans
└── docker-compose.yml
```

## Prérequis

- Docker et Docker Compose
- Node.js 18+ et pnpm
- (Optionnel) Expo Go pour l'app mobile

## Démarrage rapide

### Option 1 : Docker (recommandé pour la production)

```bash
# Copier et configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Lancer tous les services
docker compose up -d
```

L'application sera disponible sur `http://localhost:3001`

### Option 2 : Développement local

#### 1. Base de données

```bash
cd back
docker compose up -d    # Lance PostgreSQL sur le port 5433
```

#### 2. Backend (API)

```bash
cd back
pnpm install
pnpm seed              # Seed la base de données
pnpm start:dev         # Démarre sur http://localhost:3000
```

#### 3. Frontend (Web)

```bash
cd front
pnpm install
pnpm dev               # Démarre sur http://localhost:3001
```

#### 4. Mobile (Kitchen Display)

```bash
cd mobile
npm install
npx expo start         # Scanner le QR code avec Expo Go
```

## Documentation

| Document | Description |
|----------|-------------|
| [back/README.md](back/README.md) | API endpoints et architecture backend |
| [front/README.md](front/README.md) | Architecture frontend et conventions |
| [front/ARCHITECTURE.md](front/ARCHITECTURE.md) | Clean Architecture détaillée |

## Variables d'environnement

Voir [.env.example](.env.example) pour la liste complète. Variables principales :

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL |
| `NEXT_PUBLIC_API_URL` | URL de l'API (accessible depuis le navigateur) |
| `BETTER_AUTH_SECRET` | Secret pour l'authentification admin |

## Mode démo (restaurants d'exemple)

Pour une présentation MVP sans API, le front expose toujours deux restaurants d'exemple (badgés "Restaurant demo").
Ils coexistent avec les restaurants réels si l'API est disponible, et restent modifiables depuis le backoffice (édition/suppression locales).

## Parcours utilisateur

1. **Client web** : Accueil → Choix restaurant → Nombre de convives → Table → Repas → Récapitulatif → Confirmation
2. **Mode QR** : Scan QR → Commande directe à table
3. **Terminal** : Code réservation → Vérification → Place assignée
4. **Admin** : Login → Dashboard → Gestion restaurants/tables/menus/réservations
5. **Cuisine** : Sélection restaurant → Liste commandes → Marquage plats prêts