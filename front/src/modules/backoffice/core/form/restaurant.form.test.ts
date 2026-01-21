import { RestaurantForm } from '@taotask/modules/backoffice/core/form/restaurant.form';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';

describe('RestaurantForm', () => {
    let form: RestaurantForm;

    beforeEach(() => {
        form = new RestaurantForm();
    });

    // ==========================================
    // GROUPE 1 : INITIALISATION
    // ==========================================
    describe('getInitialState', () => {
        it('should return initial empty state with default values', () => {
            // GIVEN : Une nouvelle instance de form
            
            // WHEN : On récupère l'état initial
            const state = form.getInitialState();
            
            // THEN : L'état doit être vide avec stars = 3 par défaut
            expect(state).toEqual({
                name: '',
                type: '',
                stars: 0
            });
        });
    });

    // ==========================================
    // GROUPE 2 : MISE À JOUR DES CHAMPS
    // ==========================================
    describe('updateField', () => {
        it('should update name field', () => {
            // GIVEN : Un état initial
            const initialState = form.getInitialState();
            
            // WHEN : On met à jour le nom
            const newState = form.updateField(initialState, 'name', 'Le Gourmet');
            
            // THEN : Le nom doit être mis à jour
            expect(newState.name).toBe('Le Gourmet');
            // AND : Les autres champs ne changent pas
            expect(newState.type).toBe('');
            expect(newState.stars).toBe(0);
            // AND : L'état original n'est pas muté (immutabilité)
            expect(initialState.name).toBe('');
        });

        it('should update type field', () => {
            const initialState = form.getInitialState();
            const newState = form.updateField(initialState, 'type', 'Française');
            
            expect(newState.type).toBe('Française');
        });

        it('should update stars field', () => {
            const initialState = form.getInitialState();
            const newState = form.updateField(initialState, 'stars', 5);
            
            expect(newState.stars).toBe(5);
        });

        it('should handle multiple updates sequentially', () => {
            // GIVEN : Un état initial
            let state = form.getInitialState();
            
            // WHEN : On enchaîne plusieurs mises à jour
            state = form.updateField(state, 'name', 'Le Bistrot');
            state = form.updateField(state, 'type', 'Italienne');
            state = form.updateField(state, 'stars', 4);
            
            // THEN : Toutes les valeurs sont correctes
            expect(state).toEqual({
                name: 'Le Bistrot',
                type: 'Italienne',
                stars: 4
            });
        });
    });

    // ==========================================
    // GROUPE 3 : VALIDATION - isSubmitable
    // ==========================================
    describe('isSubmitable', () => {
        it('should NOT be submittable with empty name', () => {
            // GIVEN : Un état avec nom vide
            const state = { name: '', type: 'Française', stars: 3 };
            
            // WHEN : On vérifie si submittable
            const result = form.isSubmitable(state);
            
            // THEN : Doit être false
            expect(result).toBe(false);
        });

        it('should NOT be submittable with name too short (< 3 chars)', () => {
            const state = { name: 'AB', type: 'Française', stars: 3 };
            expect(form.isSubmitable(state)).toBe(false);
        });

        it('should NOT be submittable with empty type', () => {
            const state = { name: 'Le Gourmet', type: '', stars: 3 };
            expect(form.isSubmitable(state)).toBe(false);
        });

        it('should NOT be submittable with stars < 1', () => {
            const state = { name: 'Le Gourmet', type: 'Française', stars: 0 };
            expect(form.isSubmitable(state)).toBe(false);
        });

        it('should NOT be submittable with stars > 5', () => {
            const state = { name: 'Le Gourmet', type: 'Française', stars: 6 };
            expect(form.isSubmitable(state)).toBe(false);
        });

        it('should be submittable with valid data', () => {
            // GIVEN : Un état valide
            const state = { name: 'Le Gourmet', type: 'Française', stars: 4 };
            
            // WHEN : On vérifie si submittable
            const result = form.isSubmitable(state);
            
            // THEN : Doit être true
            expect(result).toBe(true);
        });

        it('should be submittable with minimum valid name (3 chars)', () => {
            const state = { name: 'ABC', type: 'Française', stars: 3 };
            expect(form.isSubmitable(state)).toBe(true);
        });

        it('should be submittable with stars = 1', () => {
            const state = { name: 'Le Gourmet', type: 'Française', stars: 1 };
            expect(form.isSubmitable(state)).toBe(true);
        });

        it('should be submittable with stars = 5', () => {
            const state = { name: 'Le Gourmet', type: 'Française', stars: 5 };
            expect(form.isSubmitable(state)).toBe(true);
        });
    });

    // ==========================================
    // GROUPE 4 : VALIDATION INDIVIDUELLE
    // ==========================================
    describe('validateName', () => {
        it('should return error for empty name', () => {
            expect(form.validateName('')).toBe('Le nom du restaurant est obligatoire');
        });

        it('should return error for name with only spaces', () => {
            expect(form.validateName('   ')).toBe('Le nom du restaurant est obligatoire');
        });

        it('should return error for name with 2 chars', () => {
            expect(form.validateName('AB')).toBe('Le nom doit contenir au moins 3 caractères');
        });

        it('should return null for valid name (3 chars)', () => {
            expect(form.validateName('ABC')).toBeNull();
        });

        it('should return null for valid name (long)', () => {
            expect(form.validateName('Le Restaurant Gourmet')).toBeNull();
        });
    });

    describe('validateType', () => {
        it('should return error for empty type', () => {
            expect(form.validateType('')).toBe('Le type de cuisine est obligatoire');
        });

        it('should return null for valid type', () => {
            expect(form.validateType('Française')).toBeNull();
        });
    });

    describe('validateStars', () => {
        it('should return error for stars = 0', () => {
            expect(form.validateStars(0)).toBe('Le nombre d\'étoiles doit être entre 1 et 5');
        });

        it('should return error for stars = -1', () => {
            expect(form.validateStars(-1)).toBe('Le nombre d\'étoiles doit être entre 1 et 5');
        });

        it('should return error for stars = 6', () => {
            expect(form.validateStars(6)).toBe('Le nombre d\'étoiles doit être entre 1 et 5');
        });

        it('should return null for stars = 1', () => {
            expect(form.validateStars(1)).toBeNull();
        });

        it('should return null for stars = 3', () => {
            expect(form.validateStars(3)).toBeNull();
        });

        it('should return null for stars = 5', () => {
            expect(form.validateStars(5)).toBeNull();
        });
    });

    // ==========================================
    // GROUPE 5 : RESET
    // ==========================================
    describe('reset', () => {
        it('should reset to initial state', () => {
            // GIVEN : Un état avec données
            const state = { name: 'Le Gourmet', type: 'Française', stars: 4 };
            
            // WHEN : On reset
            const newState = form.reset(state);
            
            // THEN : Doit revenir à l'état initial
            expect(newState).toEqual({
                name: '',
                type: '',
                stars: 0
            });
        });
    });

    // ==========================================
    // GROUPE 6 : CONVERSION DTO
    // ==========================================
    describe('toDTO', () => {
        it('should convert form state to DTO', () => {
            // GIVEN : Un état de formulaire
            const state = { name: 'Le Gourmet', type: 'Française', stars: 4 };
            
            // WHEN : On convertit en DTO
            const dto = form.toDTO(state);
            
            // THEN : Le DTO doit correspondre
            expect(dto).toEqual({
                name: 'Le Gourmet',
                type: 'Française',
                stars: 4
            });
        });

        it('should trim whitespace from name in DTO', () => {
            // GIVEN : Un état avec espaces dans le nom
            const state = { name: '  Le Gourmet  ', type: 'Française', stars: 4 };
            
            // WHEN : On convertit en DTO
            const dto = form.toDTO(state);
            
            // THEN : Le nom doit être trimé
            expect(dto.name).toBe('Le Gourmet');
        });

        it('should not modify original state when creating DTO', () => {
            // GIVEN : Un état avec espaces
            const state = { name: '  Le Gourmet  ', type: 'Française', stars: 4 };
            
            // WHEN : On convertit en DTO
            form.toDTO(state);
            
            // THEN : L'état original n'est pas modifié
            expect(state.name).toBe('  Le Gourmet  ');
        });
    });
});