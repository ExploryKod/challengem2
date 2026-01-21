import { produce } from "immer";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export class RestaurantForm {
    
    getInitialState(): BackofficeDomainModel.RestaurantForm {
        return {
            name: '',
            type: '',
            stars: 3
        };
    }

    updateField<T extends keyof BackofficeDomainModel.RestaurantForm>(
        state: BackofficeDomainModel.RestaurantForm, 
        field: T, 
        value: BackofficeDomainModel.RestaurantForm[T]
    ): BackofficeDomainModel.RestaurantForm {
        return produce(state, (draft: any) => {
            draft[field] = value;
        });
    }

    isSubmitable(state: BackofficeDomainModel.RestaurantForm): boolean {
        return (
            state.name.trim().length >= 3 &&
            state.type !== '' &&
            state.stars >= 1 && 
            state.stars <= 5
        );
    }

    validateName(name: string): string | null {
        if (!name || name.trim().length === 0) {
            return "Le nom du restaurant est obligatoire";
        }
        if (name.length < 3) {
            return "Le nom doit contenir au moins 3 caractères";
        }
        return null;
    }

    validateType(type: string): string | null {
        if (!type || type === '') {
            return "Le type de cuisine est obligatoire";
        }
        return null;
    }

    validateStars(stars: number): string | null {
        if (stars < 1 || stars > 5) {
            return "Le nombre d'étoiles doit être entre 1 et 5";
        }
        return null;
    }

    reset(state: BackofficeDomainModel.RestaurantForm): BackofficeDomainModel.RestaurantForm {
        return this.getInitialState();
    }

    toDTO(state: BackofficeDomainModel.RestaurantForm): BackofficeDomainModel.CreateRestaurantDTO {
        return {
            name: state.name.trim(),
            type: state.type,
            stars: state.stars
        };
    }
}
