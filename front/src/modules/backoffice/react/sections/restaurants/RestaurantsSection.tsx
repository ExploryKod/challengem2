'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useRestaurants } from './use-restaurants.hook';
import { isDemoRestaurantId } from '@taotask/modules/shared/demo/demo-restaurants.store';

export const RestaurantsSection: React.FC = () => {
    const router = useRouter();
    const { restaurants, isLoading, error, createRestaurant, refetch } = useRestaurants();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: '', stars: 1 });
    const [showDemoNotice, setShowDemoNotice] = useState(false);
    const noticeDurationMs = 5000;

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

    useEffect(() => {
        if (!restaurants.some((restaurant) => isDemoRestaurantId(restaurant.id))) {
            setShowDemoNotice(false);
            return;
        }

        setShowDemoNotice(true);
        const timeoutId = window.setTimeout(() => {
            setShowDemoNotice(false);
        }, 5000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [restaurants]);

    return (
        <>
        <section className="bg-luxury-bg-primary">
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
                    <div className="bg-orange-500/10 border border-orange-500/40 text-orange-300 px-6 py-4 rounded-lg mb-8 text-xs relative overflow-hidden">
                        {error}
                        <div
                            className="absolute bottom-0 left-0 h-1 w-full bg-orange-500/40 origin-left"
                            style={{ animation: `noticeShrink ${noticeDurationMs}ms linear forwards` }}
                        />
                    </div>
                )}

                {!isLoading && showDemoNotice && (
                    <div className="bg-orange-500/10 border border-orange-500/30 text-orange-300 px-6 py-4 rounded-lg mb-8 text-xs relative overflow-hidden">
                        Mode démo : restaurants d&apos;exemple affichés.
                        <div
                            className="absolute bottom-0 left-0 h-1 w-full bg-orange-500/40 origin-left"
                            style={{ animation: `noticeShrink ${noticeDurationMs}ms linear forwards` }}
                        />
                    </div>
                )}

                {!isLoading && restaurants.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-luxury-text-secondary text-lg mb-6">
                            Aucun etablissement cree pour le moment.
                        </p>
                        <LuxuryButton onClick={() => setIsModalOpen(true)}>
                            Creer votre premier etablissement
                        </LuxuryButton>
                    </div>
                )}

                {!isLoading && restaurants.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                        {restaurants.map((restaurant) => {
                            const isNotVisible = restaurant.tableCount === 0 || restaurant.mealCount === 0;
                            const tooltipText = restaurant.tableCount === 0 && restaurant.mealCount === 0
                                ? 'Ajoutez des tables et des repas pour rendre ce restaurant visible sur la page de commande'
                                : restaurant.tableCount === 0
                                ? 'Ajoutez des tables pour rendre ce restaurant visible sur la page de commande'
                                : 'Ajoutez des repas pour rendre ce restaurant visible sur la page de commande';
                            return (
                            <LuxuryCard key={restaurant.id} hoverable>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-serif text-luxury-text-primary">
                                        {restaurant.name}
                                    </h3>
                                    {isDemoRestaurantId(restaurant.id) && (
                                        <span className="inline-flex items-center rounded-full bg-luxury-gold/15 px-3 py-1 text-xs font-medium text-luxury-gold">
                                            Restaurant demo
                                        </span>
                                    )}
                                    {isNotVisible && (
                                        <div className="relative group">
                                            <div className="flex items-center gap-1 bg-luxury-rose/30 text-luxury-rose px-2 py-1 rounded-full text-xs font-medium cursor-help">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                                <span>Masque</span>
                                            </div>
                                            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-luxury-bg-secondary border border-luxury-gold-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                <p className="text-luxury-text-primary text-xs">{tooltipText}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-luxury-gold-muted mb-1">{restaurant.type}</p>
                                <p className="text-luxury-text-secondary text-sm mb-2">
                                    {'*'.repeat(restaurant.stars)} ({restaurant.stars} etoiles)
                                </p>
                                <p className="text-luxury-gold-muted text-sm mb-4">
                                    {restaurant.tableCount ?? 0} {(restaurant.tableCount ?? 0) > 1 ? 'tables' : 'table'} · {restaurant.mealCount ?? 0} {(restaurant.mealCount ?? 0) > 1 ? 'repas' : 'repas'}
                                </p>
                                <LuxuryButton
                                    variant="secondary"
                                    onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}
                                >
                                    Gerer
                                </LuxuryButton>
                            </LuxuryCard>
                        )})}
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
        <style jsx>{`
            @keyframes noticeShrink {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
        `}</style>
        </>
    );
};
