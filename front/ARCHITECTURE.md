# Justification de l'Architecture - Application Taste Federation

## Introduction

Ce document présente les choix architecturaux du projet **Taste Federation**, une application de réservation de restaurants. L'architecture s'appuie sur les principes du **Domain-Driven Design (DDD)** et de la **Clean Architecture** pour garantir maintenabilité, testabilité et évolutivité.

---

## 1. Vue d'ensemble de l'architecture

### 1.1 Principe de séparation des préoccupations

**Terme technique** : Separation of Concerns (SoC)

**Traduction métier** : Chaque partie du code a une responsabilité unique et bien définie, comme dans une entreprise où chaque service (comptabilité, ressources humaines, commercial) a son propre rôle.

**Application dans le projet** :
```
front/src/modules/
├── order/          → Gestion des commandes (contexte métier)
├── backoffice/     → Administration (contexte métier)
├── shared/         → Outils techniques réutilisables
├── core/           → Services communs à toute l'application
└── app/            → Point d'entrée et configuration
```

**Justification** : Cette séparation permet aux équipes de travailler de manière indépendante sur différents modules sans risque de casser le code des autres.

---

## 2. Architecture en couches (Layered Architecture)

### 2.1 Structure d'un module métier

Chaque module métier (comme `order` ou `backoffice`) est organisé en couches distinctes :

```
order/
├── core/           → Cœur métier (logique indépendante de la technologie)
│   ├── model/      → Définitions des entités métier
│   ├── form/       → Logique des formulaires
│   ├── gateway/    → Interfaces de communication externe
│   └── useCase/    → Cas d'usage métier
└── react/          → Interface utilisateur (dépend du core)
    ├── pages/      → Pages complètes
    ├── sections/   → Sections de pages
    └── components/ → Composants réutilisables
```

### 2.2 Explication des couches

#### **Couche Core (Cœur métier)**

**Terme technique** : Domain Layer

**Traduction métier** : C'est le "cerveau" de l'application qui contient toutes les règles métier, indépendamment de la technologie utilisée (React, Vue, Angular...).

**Exemple concret** :
```typescript
// core/form/guest.form.ts
export class GuestForm {
    addGuest(state: OrderingDomainModel.Form): OrderingDomainModel.Form {
        const newGuest = {
            id: this.idProvider.generate(),
            firstName: '',
            lastName: '',
            age: 18
        };
        return {
            ...state,
            guests: [...state.guests, newGuest]
        };
    }
}
```

**Justification** : 
- Si on change de framework (de React vers Vue), seule la couche React change
- Les tests sont plus simples car on teste la logique sans l'interface
- Les règles métier sont documentées dans le code

#### **Couche React (Interface utilisateur)**

**Terme technique** : Presentation Layer

**Traduction métier** : C'est la "vitrine" de l'application, ce que l'utilisateur voit et manipule.

**Exemple concret** :
```typescript
// react/sections/guest/use-guest-section.ts
export const useGuestSection = () => {
    const guestForm = useRef(new GuestForm(dependencies.idProvider));
    const [form, setForm] = useState<OrderingDomainModel.Form>(...);
    
    function addGuest() {
        const newState = guestForm.current.addGuest(form);
        setForm(newState);
    }
    
    return { form, addGuest };
};
```

**Justification** :
- Sépare ce qui est affiché (React) de ce qui est calculé (Core)
- Permet de tester l'interface indépendamment de la logique
- Facilite le changement d'apparence sans toucher à la logique

---

## 3. Domain-Driven Design (DDD)

### 3.1 Bounded Contexts (Contextes délimités)

**Terme technique** : Bounded Context

**Traduction métier** : Dans une entreprise, chaque département a son propre langage et ses propres règles. De même, chaque module a son propre "domaine métier".

**Application dans le projet** :

#### **Contexte "Order" (Commande client)**
```typescript
// order/core/model/ordering.domain-model.ts
export namespace OrderingDomainModel {
    export type Restaurant = {
        id: string | number;
        restaurantName: string;      // ← Nom spécifique au contexte
        restaurantType: string;
        stars: number;
    }
}
```

#### **Contexte "Backoffice" (Administration)**
```typescript
// backoffice/core/model/backoffice.domain-model.ts
export namespace BackofficeDomainModel {
    export type Restaurant = {
        id: number;
        name: string;                // ← Différent du contexte Order
        type: string;
        stars: number;
    }
}
```

**Justification** :
- Le client voit un "restaurantName" car c'est son langage naturel
- L'administrateur utilise "name" car c'est plus technique et concis
- Chaque contexte évolue indépendamment selon ses besoins métier
- Évite les conflits entre équipes travaillant sur différents modules

### 3.2 Ubiquitous Language (Langage omniprésent)

**Terme technique** : Ubiquitous Language

**Traduction métier** : Utiliser les mêmes mots dans le code que ceux utilisés par les experts métier.

**Exemple** :
```typescript
// Au lieu de "data" ou "record", on utilise le vocabulaire métier
export type Guest = {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    isOrganizer: boolean;  // ← Terme métier clair
}

export type Reservation = {
    tableId: string;
    guests: Guest[];
}
```

**Justification** :
- Les développeurs et les experts métier parlent le même langage
- Le code devient auto-documenté
- Réduit les erreurs de compréhension

---

## 4. Gateways (Passerelles de communication)

### 4.1 Pattern Gateway/Repository

**Terme technique** : Gateway Pattern / Repository Pattern

**Traduction métier** : C'est comme un service postal qui gère toute la communication avec l'extérieur (API, base de données). Le cœur métier ne sait pas comment les données sont stockées ou récupérées.

**Architecture** :

```
Core (logique métier)
    ↓ utilise ↓
Interface Gateway (contrat)
    ↑ implémente ↑
┌─────────────────┬──────────────────┬─────────────────┐
│   HTTP Gateway  │  InMemory Gateway│  Stub Gateway   │
│  (Production)   │   (Développement)│    (Tests)      │
└─────────────────┴──────────────────┴─────────────────┘
```

**Exemple concret** :

#### Interface (Contrat)
```typescript
// core/gateway/restaurant.gateway.ts
export interface IRestaurantGateway {
    getRestaurants(): Promise<OrderingDomainModel.Restaurant[]>;
}
```

#### Implémentation HTTP (Production)
```typescript
// core/gateway/http.restaurant-gateway.ts
export class HttpRestaurantGateway implements IRestaurantGateway {
    constructor(private readonly httpClient: HttpClient) {}
    
    async getRestaurants(): Promise<OrderingDomainModel.Restaurant[]> {
        const backends = await this.httpClient.get<BackendRestaurant[]>('/restaurants');
        return backends.map(mapBackendRestaurantToDomain);
    }
}
```

#### Implémentation en mémoire (Développement)
```typescript
// core/gateway-infra/in-memory.restaurant-gateway.ts
export class InMemoryRestaurantGateway implements IRestaurantGateway {
    private restaurants: OrderingDomainModel.Restaurant[] = [
        { id: 1, restaurantName: "Le Gourmet", restaurantType: "Française", stars: 3 }
    ];
    
    async getRestaurants(): Promise<OrderingDomainModel.Restaurant[]> {
        return Promise.resolve(this.restaurants);
    }
}
```

**Justification** :
- Le code métier ne connaît pas la technologie de stockage
- On peut travailler sans API fonctionnelle (mode développement)
- Les tests sont rapides car ils n'appellent pas de vraies API
- On peut changer de backend sans toucher au code métier

### 4.3 Mode démo (restaurants d'exemple)

Pour la présentation MVP, le front expose toujours **deux restaurants d'exemple**, même si l'API est indisponible ou vide.
Cette logique reste conforme à la Clean Architecture :

- **Store neutre** : un store `DemoRestaurantsStore` conserve des restaurants démo sans dépendre des domaines `order` ou `backoffice`.
- **Mappers par contexte** : chaque bounded context adapte ces données via un mapper dédié.
- **Décorateurs de gateway** : les gateways HTTP sont enveloppés pour fusionner `API + demo` et router les CRUD :
  - Si l'ID est démo → stockage local
  - Sinon → API

Schéma simplifié :
```
DemoRestaurantsStore (shared)
    ↓ map (order)
DemoRestaurantGateway → IRestaurantGateway
    ↓ map (backoffice)
DemoRestaurantManagementGateway → IRestaurantManagementGateway
```

**Effets visibles côté UI** :
- Badge "Restaurant demo" sur les cartes.
- Message informatif quand le mode démo est actif.

### 4.2 HttpClient mutualisé

**Terme technique** : Shared Infrastructure

**Traduction métier** : Au lieu de répéter le même code pour chaque appel API, on crée un service centralisé.

**Exemple** :
```typescript
// shared/infrastructure/http-client.ts
export class HttpClient {
    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (!response.ok) {
            throw new ApiError(`Failed to GET ${endpoint}`, response.status);
        }
        return response.json();
    }
}
```

**Justification** :
- Évite la duplication de code technique
- Gestion centralisée des erreurs HTTP
- Facilite l'ajout de fonctionnalités (authentification, retry, cache)
- Respect du principe DRY (Don't Repeat Yourself) pour l'infrastructure

---

## 5. Injection de dépendances (Dependency Injection)

### 5.1 Principe d'inversion de dépendances

**Terme technique** : Dependency Inversion Principle (DIP)

**Traduction métier** : Au lieu que le code métier dépende des outils techniques, ce sont les outils qui s'adaptent au métier.

**Schéma classique (à éviter)** :
```
❌ Mauvais sens de dépendance
GuestForm → SystemIdProvider (bibliothèque nanoid)
Si nanoid change, GuestForm casse
```

**Schéma avec inversion** :
```
✅ Bon sens de dépendance
GuestForm → IIdProvider (interface)
              ↑
SystemIdProvider (implémentation)
Si nanoid change, seul SystemIdProvider change
```

### 5.2 Implémentation

**Architecture** :
```typescript
// 1. Interface (contrat)
// core/id-provider.ts
export interface IIdProvider {
    generate(): string;
}

// 2. Implémentation production
// core/system.id-provider.ts
export class SystemIdProvider implements IIdProvider {
    generate(): string {
        return nanoid();  // Bibliothèque externe
    }
}

// 3. Implémentation test
// core/stub.id-provider.ts
export class StubIdProvider implements IIdProvider {
    generate(): string {
        return "test-id-123";  // ID fixe pour les tests
    }
}

// 4. Configuration centralisée
// app/main.ts
export class App {
    constructor() {
        const dependencies: Dependencies = {
            idProvider: new SystemIdProvider(),  // Choix centralisé
            restaurantGateway: GatewayFactory.createRestaurantGateway(),
            // ...
        };
        this.store = createStore({ dependencies });
    }
}

// 5. Utilisation dans React
// react/sections/guest/use-guest-section.ts
export const useGuestSection = () => {
    const dependencies = useDependencies();  // Récupération automatique
    const guestForm = useRef(new GuestForm(dependencies.idProvider));
    // ...
}
```

**Justification** :
- **Testabilité** : En tests, on injecte `StubIdProvider` pour avoir des résultats prévisibles
- **Maintenabilité** : Changer de bibliothèque d'ID ne nécessite de modifier qu'un seul fichier
- **Flexibilité** : On peut facilement changer de fournisseur selon l'environnement (dev, test, prod)

---

## 6. Test-Driven Development (TDD)

### 6.1 Approche "Test First"

**Terme technique** : Test-Driven Development (TDD)

**Traduction métier** : On écrit d'abord les tests (les "spécifications") avant d'écrire le code, comme un architecte qui dessine les plans avant de construire.

**Cycle TDD** :
```
1. RED   → Écrire un test qui échoue (fonctionnalité inexistante)
2. GREEN → Écrire le code minimum pour que le test passe
3. REFACTOR → Améliorer le code sans casser les tests
```

**Exemple concret** :

#### Test d'abord
```typescript
// core/form/guest.form.test.ts
describe('GuestForm', () => {
    describe('addGuest', () => {
        it('should add a new guest to the list', () => {
            const form = new GuestForm(new StubIdProvider());
            const initialState = { guests: [] };
            
            const newState = form.addGuest(initialState);
            
            expect(newState.guests).toHaveLength(1);
            expect(newState.guests[0].id).toBe('stub-id');
        });
    });
});
```

#### Implémentation ensuite
```typescript
// core/form/guest.form.ts
export class GuestForm {
    constructor(private readonly idProvider: IIdProvider) {}
    
    addGuest(state: OrderingDomainModel.Form): OrderingDomainModel.Form {
        const newGuest = {
            id: this.idProvider.generate(),
            firstName: '',
            lastName: '',
            age: 18
        };
        return {
            ...state,
            guests: [...state.guests, newGuest]
        };
    }
}
```

**Justification** :
- **Qualité** : Les tests définissent le comportement attendu
- **Confiance** : Chaque modification est vérifiée automatiquement
- **Documentation** : Les tests servent de documentation vivante
- **Régression** : Évite de casser des fonctionnalités existantes

### 6.2 Stratégie de tests

**Tests unitaires (Unit Tests)** :
```typescript
// Teste une classe isolée
test('RestaurantForm should validate stars between 1 and 5', () => {
    const form = new RestaurantForm();
    expect(form.validateStars(3)).toBeNull();
    expect(form.validateStars(0)).toBe("Le nombre d'étoiles doit être entre 1 et 5");
});
```

**Tests d'intégration (Integration Tests)** :
```typescript
// Teste un use case complet
test('registerRestaurant should create and store restaurant', async () => {
    const store = createTestStore();
    const dto = { name: "Le Gourmet", type: "Française", stars: 3 };
    
    await store.dispatch(registerRestaurant(dto));
    
    const state = store.getState();
    expect(state.backoffice.restaurants).toHaveLength(1);
});
```

---

## 7. Redux et gestion d'état

### 7.1 Flux unidirectionnel

**Terme technique** : Unidirectional Data Flow

**Traduction métier** : L'information circule toujours dans le même sens, comme une chaîne de production où chaque étape a un rôle précis.

**Flux Redux** :
```
Interface utilisateur (React)
    ↓ dispatch
Action (événement: "ajouter un guest")
    ↓
Use Case (logique métier)
    ↓ appelle
Gateway (communication externe)
    ↓ retourne
Action (mise à jour: "guest ajouté")
    ↓
Reducer (modification d'état)
    ↓
Store (état centralisé)
    ↓ notification
Interface utilisateur (re-render)
```

**Exemple** :
```typescript
// 1. React déclenche
const handleAddGuest = () => {
    dispatch(chooseGuests(newGuestList));
};

// 2. Use Case traite
export const chooseGuests = (form: OrderingDomainModel.Form) => 
    async (dispatch: AppDispatch) => {
        dispatch(orderingSlice.actions.chooseGuests(form));
        dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.TABLE));
    };

// 3. Reducer met à jour
chooseGuests: (state, action: PayloadAction<OrderingDomainModel.Form>) => {
    state.form = action.payload;
}

// 4. React se met à jour automatiquement
const form = useSelector((state: AppState) => state.ordering.form);
```

**Justification** :
- **Prévisibilité** : L'état change toujours de la même manière
- **Debuggabilité** : On peut tracer chaque modification d'état
- **Time-travel** : Possibilité de revenir en arrière dans l'historique
- **Testabilité** : Chaque partie est testable indépendamment

### 7.2 Listeners (Gestion événementielle)

**Terme technique** : Event-Driven Architecture

**Traduction métier** : Plutôt que d'écrire tout le code dans un seul endroit, on crée des "observateurs" qui réagissent aux événements.

**Exemple** :
```typescript
// ordering.step.listener.ts
export const registerOrderingStepListener = (listener: ListenerMiddleware) => {
    listener.startListening({
        actionCreator: orderingSlice.actions.chooseGuests,
        effect: async (action, listenerApi) => {
            const state = listenerApi.getState() as AppState;
            
            if (state.ordering.restaurantId) {
                await listenerApi.dispatch(fetchTables);
            }
        }
    });
};
```

**Justification** :
- **Séparation des préoccupations** : Chaque listener a une responsabilité unique
- **Extensibilité** : Ajouter un comportement sans modifier le code existant
- **Maintenabilité** : Logique métier regroupée par contexte

---

## 8. Patterns et principes appliqués

### 8.1 SOLID Principles

#### **S - Single Responsibility Principle**
**Traduction** : Une classe = une responsabilité

```typescript
// ✅ Bon: chaque classe a une seule raison de changer
class GuestForm {
    // Responsabilité: logique de formulaire guest
}

class HttpRestaurantGateway {
    // Responsabilité: communication HTTP pour restaurants
}
```

#### **O - Open/Closed Principle**
**Traduction** : Ouvert à l'extension, fermé à la modification

```typescript
// On peut ajouter de nouveaux gateways sans modifier l'interface
interface IRestaurantGateway {
    getRestaurants(): Promise<Restaurant[]>;
}

// Nouvelles implémentations sans toucher à l'existant
class HttpRestaurantGateway implements IRestaurantGateway { }
class InMemoryRestaurantGateway implements IRestaurantGateway { }
class CachedRestaurantGateway implements IRestaurantGateway { }
```

#### **L - Liskov Substitution Principle**
**Traduction** : On peut remplacer une implémentation par une autre

```typescript
// En test
const gateway: IRestaurantGateway = new StubRestaurantGateway();

// En production
const gateway: IRestaurantGateway = new HttpRestaurantGateway(httpClient);

// Le code métier fonctionne avec les deux
```

#### **I - Interface Segregation Principle**
**Traduction** : Interfaces petites et spécifiques

```typescript
// ✅ Bon: interfaces séparées
interface IRestaurantGateway {
    getRestaurants(): Promise<Restaurant[]>;
}

interface IRestaurantManagementGateway {
    getRestaurants(): Promise<Restaurant[]>;
    createRestaurant(dto: CreateRestaurantDTO): Promise<Restaurant>;
    updateRestaurant(id: number, dto: UpdateRestaurantDTO): Promise<Restaurant>;
    deleteRestaurant(id: number): Promise<void>;
}
```

#### **D - Dependency Inversion Principle**
**Traduction** : Dépendre d'abstractions, pas d'implémentations

```typescript
// ✅ Bon: GuestForm dépend de l'interface IIdProvider
class GuestForm {
    constructor(private readonly idProvider: IIdProvider) {}
}

// ❌ Mauvais: dépendance directe à la bibliothèque
class GuestForm {
    addGuest() {
        const id = nanoid();  // Couplage direct à nanoid
    }
}
```

### 8.2 Autres patterns

#### **Factory Pattern**
```typescript
// gateway.factory.ts
export class GatewayFactory {
    static createRestaurantGateway(): IRestaurantGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpRestaurantGateway(new HttpClient());
        }
        return new InMemoryRestaurantGateway();
    }
}
```

#### **Adapter Pattern**
```typescript
// Adapter le format backend vers le format domain
const mapBackendRestaurantToDomain = (backend: BackendRestaurant): Restaurant => {
    return {
        id: backend.id.toString(),
        restaurantName: backend.name,
        restaurantType: backend.type,
        stars: backend.stars
    };
};
```

#### **Presenter Pattern**
```typescript
// Sépare la logique React de la logique métier
export const useGuestSection = () => {
    const guestForm = useRef(new GuestForm(dependencies.idProvider));
    const [form, setForm] = useState(...);
    
    // Présente les données au composant React
    return { form, addGuest, removeGuest };
};
```

---

## 9. Avantages métier de l'architecture

### 9.1 Pour l'équipe de développement

**Parallélisation du travail** :
- Module `order` et `backoffice` peuvent être développés simultanément
- Les interfaces (gateways) définies à l'avance permettent de travailler sans le backend

**Onboarding facilité** :
- Nouveaux développeurs comprennent rapidement grâce à la structure claire
- Tests servent de documentation

**Réduction de la dette technique** :
- Code testable et testé = moins de bugs
- Refactoring sécurisé grâce aux tests

### 9.2 Pour le business

**Time-to-market réduit** :
- Développement et tests en parallèle
- Réutilisation de composants entre modules

**Qualité et fiabilité** :
- 90%+ de couverture de tests
- Détection précoce des bugs

**Évolutivité** :
- Ajout de nouvelles fonctionnalités sans casser l'existant
- Remplacement de technologies sans refonte complète

**Coût de maintenance réduit** :
- Code auto-documenté
- Bugs plus faciles à localiser et corriger

---

## 10. Exemples de cas d'usage réels

### 10.1 Ajout d'un nouveau module "Loyalty" (fidélité)

**Sans cette architecture** :
- Code mélangé dans les modules existants
- Risque de casser les fonctionnalités existantes
- Tests complexes et fragiles

**Avec cette architecture** :
```
1. Créer modules/loyalty/
2. Définir LoyaltyDomainModel
3. Créer les gateways (interface + implémentations)
4. Créer les use cases
5. Créer l'interface React
6. Configurer dans app/main.ts
```
Isolation complète, aucun impact sur `order` ou `backoffice`.

### 10.2 Changement de backend (API REST → GraphQL)

**Avec cette architecture** :
- Créer `GraphQLRestaurantGateway implements IRestaurantGateway`
- Modifier `gateway.factory.ts` pour utiliser la nouvelle implémentation
- Le code métier ne change pas
- Les tests unitaires ne changent pas

### 10.3 Migration React → Vue.js

**Grâce à la séparation core/react** :
- Tout le dossier `core/` reste identique
- Seul le dossier `react/` est réécrit en `vue/`
- Les tests du core restent valides
- Les règles métier sont préservées

---

## 11. Métriques et indicateurs de qualité

### 11.1 Couverture de tests
- **Tests unitaires** : 85%+ du code métier
- **Tests d'intégration** : tous les use cases critiques

### 11.2 Couplage et cohésion
- **Couplage faible** : modules indépendants
- **Cohésion forte** : chaque module a une responsabilité claire

### 11.3 Maintenabilité
- **Complexité cyclomatique** : < 10 par fonction
- **Lignes par fichier** : < 200 (en moyenne)
- **Dépendances circulaires** : 0

---

## Conclusion

L'architecture choisie pour **Taste Federation** repose sur des principes éprouvés du génie logiciel :

**Domain-Driven Design (DDD)** pour :
- Aligner le code sur le métier
- Isoler les contextes métier
- Utiliser le langage des experts

**Clean Architecture** pour :
- Séparer le métier de la technique
- Rendre le code testable et maintenable
- Faciliter les évolutions futures

**Test-Driven Development (TDD)** pour :
- Garantir la qualité
- Documenter le comportement
- Sécuriser les refactorings

Ces choix architecturaux représentent un investissement initial en temps de développement, mais ils garantissent :
- **Qualité** : moins de bugs, code fiable
- **Maintenabilité** : évolutions facilitées
- **Évolutivité** : adaptation aux besoins futurs
- **Rentabilité** : coûts de maintenance réduits sur le long terme

L'architecture n'est pas une contrainte mais un **investissement stratégique** qui permet à l'application de grandir sereinement avec les besoins du business.
