'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useRestaurants } from './use-restaurants.hook';

export const RestaurantsSection: React.FC = () => {
    const router = useRouter();
    const { restaurants, isLoading, error, createRestaurant, refetch } = useRestaurants();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: '', stars: 1 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === 'number' ? parseInt(target.value, 10) : target.value;
        setFormData((prev) => ({ ...prev, [target.name]: value }));
    };

    const handleSubmit = async () => {
        await createRestaurant(formData);
        setFormData({ name: '', type: '', stars: 1 });
        setIsModalOpen(false);
    };

    return (
        <section className="min-h-screen bg-luxury-bg-primary">
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12">
                    <div>
                        <h1 className="text-4xl font-serif text-luxury-text-primary mb-2">
                            Vos Etablissements
                        </h1>
                        <div className="h-1 w-24 bg-luxury-gold" />
                    </div>
                    <LuxuryButton onClick={() => setIsModalOpen(true)}>
                        + Creer
                    </LuxuryButton>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="text-luxury-gold">Chargement...</div>
                    </div>
                )}

                {error && (
                    <div className="bg-luxury-rose/20 border border-luxury-rose text-luxury-text-primary px-6 py-4 rounded-lg mb-8">
                        {error}
                    </div>
                )}

                {!isLoading && !error && restaurants.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-luxury-text-secondary text-lg mb-6">
                            Aucun etablissement cree pour le moment.
                        </p>
                        <LuxuryButton onClick={() => setIsModalOpen(true)}>
                            Creer votre premier etablissement
                        </LuxuryButton>
                    </div>
                )}

                {!isLoading && !error && restaurants.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                        {restaurants.map((restaurant) => (
                            <LuxuryCard key={restaurant.id} hoverable>
                                <h3 className="text-xl font-serif text-luxury-text-primary mb-2">
                                    {restaurant.name}
                                </h3>
                                <p className="text-luxury-gold-muted mb-1">{restaurant.type}</p>
                                <p className="text-luxury-text-secondary text-sm mb-2">
                                    {'*'.repeat(restaurant.stars)} ({restaurant.stars} etoiles)
                                </p>
                                {restaurant.tableCount !== undefined && (
                                    <p className="text-luxury-gold-muted text-sm mb-4">
                                        {restaurant.tableCount} {restaurant.tableCount > 1 ? 'tables' : 'table'}
                                    </p>
                                )}
                                <LuxuryButton
                                    variant="secondary"
                                    onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}
                                >
                                    Gerer
                                </LuxuryButton>
                            </LuxuryCard>
                        ))}
                    </div>
                )}
            </div>

            <LuxuryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nouvel etablissement"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Le Chateau"
                        required
                    />
                    <LuxuryInput
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Ex: Gastronomique"
                        required
                    />
                    <LuxuryInput
                        label="Etoiles"
                        name="stars"
                        type="number"
                        value={formData.stars}
                        onChange={handleChange}
                        min={1}
                        max={5}
                        required
                    />
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleSubmit}>Creer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>
        </section>
    );
};
