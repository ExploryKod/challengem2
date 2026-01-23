'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useMenus } from './use-menus.hook';

interface MenusSectionProps {
    restaurantId: number;
}

const MEAL_TYPE_LABELS: Record<string, string> = {
    ENTRY: 'Entree',
    MAIN_COURSE: 'Plat',
    DESSERT: 'Dessert',
    DRINK: 'Boisson',
};

const initialFormData = {
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
};

export const MenusSection: React.FC<MenusSectionProps> = ({ restaurantId }) => {
    const { menus, isLoading, createMenu, deleteMenu, toggleActive } = useMenus(restaurantId);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const handleCreate = async () => {
        await createMenu({
            restaurantId,
            title: formData.title,
            description: formData.description,
            price: formData.price,
            imageUrl: formData.imageUrl || '/placeholder-menu.jpg',
        });
        setFormData(initialFormData);
        setIsCreateModalOpen(false);
    };

    const handleDelete = async (menuId: number) => {
        if (confirm('Etes-vous sur de vouloir supprimer ce menu ?')) {
            await deleteMenu(menuId);
        }
    };

    if (isLoading) {
        return <div className="text-luxury-gold">Chargement des menus...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-text-primary">
                    Menus ({menus.length})
                </h2>
                <LuxuryButton onClick={() => setIsCreateModalOpen(true)}>+ Ajouter</LuxuryButton>
            </div>

            {menus.length === 0 ? (
                <div className="text-center py-12 text-luxury-text-secondary">
                    Aucun menu pour ce restaurant. Commencez par en creer un.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map((menu) => (
                        <LuxuryCard key={menu.id} hoverable>
                            {menu.imageUrl && (
                                <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
                                    <Image
                                        src={menu.imageUrl}
                                        alt={menu.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-semibold text-luxury-text-primary">
                                    {menu.title}
                                </h4>
                                <span className={`px-2 py-1 rounded text-xs ${menu.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {menu.isActive ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                            <p className="text-luxury-text-secondary text-sm mb-2">{menu.description}</p>
                            <p className="text-luxury-gold font-semibold mb-3">{menu.price.toFixed(2)} EUR</p>

                            {menu.items && menu.items.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-luxury-gold-muted uppercase mb-1">Inclus:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {menu.items.map((item, idx) => (
                                            <span key={idx} className="text-xs bg-luxury-bg-primary px-2 py-1 rounded text-luxury-text-secondary">
                                                {item.quantity}x {MEAL_TYPE_LABELS[item.mealType]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 mt-4">
                                <LuxuryButton
                                    variant="secondary"
                                    onClick={() => toggleActive(menu.id, !menu.isActive)}
                                >
                                    {menu.isActive ? 'Desactiver' : 'Activer'}
                                </LuxuryButton>
                                <LuxuryButton
                                    variant="destructive"
                                    onClick={() => handleDelete(menu.id)}
                                >
                                    Supprimer
                                </LuxuryButton>
                            </div>
                        </LuxuryCard>
                    ))}
                </div>
            )}

            <LuxuryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Nouveau menu"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom du menu"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Menu Decouverte"
                        required
                    />
                    <LuxuryInput
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Ex: Entree + Plat + Dessert"
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
        </div>
    );
};
