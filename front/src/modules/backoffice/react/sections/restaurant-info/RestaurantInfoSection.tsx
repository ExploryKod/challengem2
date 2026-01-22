'use client';
import React, { useState } from 'react';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useAppDispatch } from '@taotask/modules/store/store';
import { updateRestaurantUseCase } from '@taotask/modules/backoffice/core/useCase/update-restaurant.usecase';

interface RestaurantInfoSectionProps {
    restaurant: BackofficeDomainModel.Restaurant;
}

export const RestaurantInfoSection: React.FC<RestaurantInfoSectionProps> = ({ restaurant }) => {
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: restaurant.name,
        type: restaurant.type,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        await dispatch(updateRestaurantUseCase(restaurant.id, formData));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ name: restaurant.name, type: restaurant.type });
        setIsEditing(false);
    };

    return (
        <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-text-primary">
                    Informations du restaurant
                </h2>
                {!isEditing && (
                    <LuxuryButton variant="secondary" onClick={() => setIsEditing(true)}>
                        Modifier
                    </LuxuryButton>
                )}
            </div>

            <LuxuryCard>
                {isEditing ? (
                    <div className="space-y-4">
                        <LuxuryInput
                            label="Nom"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <LuxuryInput
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        />
                        <div className="flex gap-4 pt-4">
                            <LuxuryButton onClick={handleSave}>Enregistrer</LuxuryButton>
                            <LuxuryButton variant="secondary" onClick={handleCancel}>
                                Annuler
                            </LuxuryButton>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm text-luxury-gold-muted uppercase tracking-wider">
                                Nom
                            </span>
                            <p className="text-luxury-text-primary text-lg">{restaurant.name}</p>
                        </div>
                        <div>
                            <span className="text-sm text-luxury-gold-muted uppercase tracking-wider">
                                Type
                            </span>
                            <p className="text-luxury-text-primary text-lg">{restaurant.type}</p>
                        </div>
                    </div>
                )}
            </LuxuryCard>
        </div>
    );
};
