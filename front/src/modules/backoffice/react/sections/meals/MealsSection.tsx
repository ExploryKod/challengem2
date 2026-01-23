'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { LuxurySelect } from '../../components/ui/LuxurySelect';
import { useMeals } from './use-meals.hook';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';

interface MealsSectionProps {
    restaurantId: number;
}

const MEAL_TYPE_OPTIONS = [
    { value: 'ENTRY', label: 'Entree' },
    { value: 'MAIN_COURSE', label: 'Plat' },
    { value: 'DESSERT', label: 'Dessert' },
    { value: 'DRINK', label: 'Boisson' },
];

const initialFormData = {
    title: '',
    type: 'ENTRY' as BackofficeDomainModel.MealType,
    price: 0,
    imageUrl: '',
};

export const MealsSection: React.FC<MealsSectionProps> = ({ restaurantId }) => {
    const { meals, isLoading, createMeal, deleteMeal, updateMeal } = useMeals(restaurantId);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState<BackofficeDomainModel.Meal | null>(null);
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const handleCreate = async () => {
        await createMeal({
            restaurantId,
            title: formData.title,
            type: formData.type,
            price: formData.price,
            imageUrl: formData.imageUrl || '/placeholder-meal.jpg',
        });
        setFormData(initialFormData);
        setIsCreateModalOpen(false);
    };

    const handleEdit = (meal: BackofficeDomainModel.Meal) => {
        setEditingMeal(meal);
        setFormData({
            title: meal.title,
            type: meal.type,
            price: meal.price,
            imageUrl: meal.imageUrl,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingMeal) return;
        await updateMeal(editingMeal.id, {
            title: formData.title,
            type: formData.type,
            price: formData.price,
            imageUrl: formData.imageUrl,
        });
        setFormData(initialFormData);
        setEditingMeal(null);
        setIsEditModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingMeal(null);
        setFormData(initialFormData);
    };

    const handleDelete = async (mealId: number) => {
        if (confirm('Etes-vous sur de vouloir supprimer ce repas ?')) {
            await deleteMeal(mealId);
        }
    };

    if (isLoading) {
        return <div className="text-luxury-gold">Chargement des repas...</div>;
    }

    const mealsByType = {
        ENTRY: meals.filter((m) => m.type === 'ENTRY'),
        MAIN_COURSE: meals.filter((m) => m.type === 'MAIN_COURSE'),
        DESSERT: meals.filter((m) => m.type === 'DESSERT'),
        DRINK: meals.filter((m) => m.type === 'DRINK'),
    };

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-text-primary">
                    Repas ({meals.length})
                </h2>
                <LuxuryButton onClick={() => setIsCreateModalOpen(true)}>+ Ajouter</LuxuryButton>
            </div>

            {meals.length === 0 ? (
                <div className="text-center py-12 text-luxury-text-secondary">
                    Aucun repas pour ce restaurant. Commencez par en creer un.
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(mealsByType).map(([type, typeMeals]) => {
                        if (typeMeals.length === 0) return null;
                        const label = BackofficeDomainModel.MealTypeLabels[type as BackofficeDomainModel.MealType];
                        return (
                            <div key={type}>
                                <h3 className="text-lg font-medium text-luxury-gold mb-4">{label}s</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {typeMeals.map((meal) => (
                                        <LuxuryCard key={meal.id} hoverable>
                                            {meal.imageUrl && (
                                                <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={meal.imageUrl}
                                                        alt={meal.title}
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder-meal.jpg';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <h4 className="text-lg font-semibold text-luxury-text-primary mb-2">
                                                {meal.title}
                                            </h4>
                                            <p className="text-luxury-gold mb-2">{meal.price.toFixed(2)} EUR</p>
                                            {meal.requiredAge && (
                                                <p className="text-luxury-rose text-sm mb-2">
                                                    Age minimum: {meal.requiredAge} ans
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-4">
                                                <LuxuryButton
                                                    variant="secondary"
                                                    onClick={() => handleEdit(meal)}
                                                >
                                                    Modifier
                                                </LuxuryButton>
                                                <LuxuryButton
                                                    variant="destructive"
                                                    onClick={() => handleDelete(meal.id)}
                                                >
                                                    Supprimer
                                                </LuxuryButton>
                                            </div>
                                        </LuxuryCard>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            <LuxuryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Nouveau repas"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom du repas"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Salade Caesar"
                        required
                    />
                    <LuxurySelect
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        options={MEAL_TYPE_OPTIONS}
                        required
                    />
                    <LuxuryInput
                        label="Prix (EUR)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        min={0}
                        required
                    />
                    <LuxuryInput
                        label="URL de l'image"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleCreate}>Creer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>

            {/* Edit Modal */}
            <LuxuryModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title="Modifier le repas"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom du repas"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Salade Caesar"
                        required
                    />
                    <LuxurySelect
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        options={MEAL_TYPE_OPTIONS}
                        required
                    />
                    <LuxuryInput
                        label="Prix (EUR)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        min={0}
                        required
                    />
                    <LuxuryInput
                        label="URL de l'image"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleUpdate}>Enregistrer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={closeEditModal}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>
        </div>
    );
};
