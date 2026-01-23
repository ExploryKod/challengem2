'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useMenus } from './use-menus.hook';
import { BackofficeDomainModel } from '../../../core/model/backoffice.domain-model';

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
    items: [
        { mealType: 'ENTRY', quantity: 0 },
        { mealType: 'MAIN_COURSE', quantity: 0 },
        { mealType: 'DESSERT', quantity: 0 },
        { mealType: 'DRINK', quantity: 0 },
    ],
};

export const MenusSection: React.FC<MenusSectionProps> = ({ restaurantId }) => {
    const { menus, isLoading, error, createMenu, updateMenu, deleteMenu, toggleActive } = useMenus(restaurantId);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<BackofficeDomainModel.Menu | null>(null);
    const [editFormData, setEditFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            items: formData.items.filter(item => item.quantity > 0),
        });
        setFormData(initialFormData);
        setIsCreateModalOpen(false);
    };

    const handleEdit = (menu: BackofficeDomainModel.Menu) => {
        setEditingMenu(menu);
        setEditFormData({
            title: menu.title,
            description: menu.description,
            price: menu.price,
            imageUrl: menu.imageUrl,
            items: [
                { mealType: 'ENTRY', quantity: menu.items.find(i => i.mealType === 'ENTRY')?.quantity || 0 },
                { mealType: 'MAIN_COURSE', quantity: menu.items.find(i => i.mealType === 'MAIN_COURSE')?.quantity || 0 },
                { mealType: 'DESSERT', quantity: menu.items.find(i => i.mealType === 'DESSERT')?.quantity || 0 },
                { mealType: 'DRINK', quantity: menu.items.find(i => i.mealType === 'DRINK')?.quantity || 0 },
            ],
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingMenu) return;
        await updateMenu(editingMenu.id, {
            title: editFormData.title,
            description: editFormData.description,
            price: editFormData.price,
            imageUrl: editFormData.imageUrl,
            items: editFormData.items.filter(item => item.quantity > 0),
        });
        setEditFormData(initialFormData);
        setEditingMenu(null);
        setIsEditModalOpen(false);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setEditFormData((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const handleDelete = async (menuId: number) => {
        if (confirm('Etes-vous sur de vouloir supprimer ce menu ?')) {
            await deleteMenu(menuId);
        }
    };

    if (isLoading) {
        return <div className="text-luxury-gold">Chargement des menus...</div>;
    }

    if (error) {
        return <div className="text-red-400">{error}</div>;
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
                    {menus.map((menu) => {
                        const hasNoItems = !menu.items || menu.items.length === 0;
                        return (
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
                                <div className="flex items-center gap-2">
                                    {hasNoItems && (
                                        <div className="relative group">
                                            <div className="flex items-center gap-1 bg-luxury-rose/30 text-luxury-rose px-2 py-1 rounded-full text-xs font-medium cursor-help">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                                <span>Vide</span>
                                            </div>
                                            <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-luxury-bg-secondary border border-luxury-gold-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                <p className="text-luxury-text-primary text-xs">Ce menu n&apos;a aucun element. Ajoutez des elements pour qu&apos;il soit visible sur la page de commande.</p>
                                            </div>
                                        </div>
                                    )}
                                    <span className={`px-2 py-1 rounded text-xs ${menu.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {menu.isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
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
                                    onClick={() => handleEdit(menu)}
                                >
                                    Modifier
                                </LuxuryButton>
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
                    )})}
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
                    {/* Menu Composition */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-luxury-text-primary">
                            Composition du menu
                        </label>
                        {formData.items.map((item, index) => (
                            <div key={item.mealType} className="flex items-center justify-between">
                                <span className="text-sm text-luxury-text-secondary">
                                    {MEAL_TYPE_LABELS[item.mealType]}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newItems = [...formData.items];
                                            newItems[index].quantity = Math.max(0, item.quantity - 1);
                                            setFormData(prev => ({ ...prev, items: newItems }));
                                        }}
                                        className="w-8 h-8 rounded bg-luxury-bg-secondary text-luxury-text-primary hover:bg-luxury-gold/20"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-luxury-text-primary">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newItems = [...formData.items];
                                            newItems[index].quantity = item.quantity + 1;
                                            setFormData(prev => ({ ...prev, items: newItems }));
                                        }}
                                        className="w-8 h-8 rounded bg-luxury-bg-secondary text-luxury-text-primary hover:bg-luxury-gold/20"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
                onClose={() => setIsEditModalOpen(false)}
                title="Modifier le menu"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom du menu"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        placeholder="Ex: Menu Decouverte"
                        required
                    />
                    <LuxuryInput
                        label="Description"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        placeholder="Ex: Entree + Plat + Dessert"
                        required
                    />
                    <LuxuryInput
                        label="Prix (EUR)"
                        name="price"
                        type="number"
                        value={editFormData.price}
                        onChange={handleEditChange}
                        min={0}
                        required
                    />
                    <LuxuryInput
                        label="URL de l'image"
                        name="imageUrl"
                        value={editFormData.imageUrl}
                        onChange={handleEditChange}
                        placeholder="https://example.com/image.jpg"
                    />
                    {/* Menu Composition */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-luxury-text-primary">
                            Composition du menu
                        </label>
                        {editFormData.items.map((item, index) => (
                            <div key={item.mealType} className="flex items-center justify-between">
                                <span className="text-sm text-luxury-text-secondary">
                                    {MEAL_TYPE_LABELS[item.mealType]}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditFormData(prev => ({
                                                ...prev,
                                                items: prev.items.map((it, i) =>
                                                    i === index ? { ...it, quantity: Math.max(0, it.quantity - 1) } : it
                                                )
                                            }));
                                        }}
                                        className="w-8 h-8 rounded bg-luxury-bg-secondary text-luxury-text-primary hover:bg-luxury-gold/20"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-luxury-text-primary">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditFormData(prev => ({
                                                ...prev,
                                                items: prev.items.map((it, i) =>
                                                    i === index ? { ...it, quantity: it.quantity + 1 } : it
                                                )
                                            }));
                                        }}
                                        className="w-8 h-8 rounded bg-luxury-bg-secondary text-luxury-text-primary hover:bg-luxury-gold/20"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleUpdate}>Enregistrer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>
        </div>
    );
};
