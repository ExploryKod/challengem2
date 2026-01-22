'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { LuxuryTabs } from '../../components/ui/LuxuryTabs';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { useRestaurantDetail } from './use-restaurant-detail';
import { TablesSection } from '../../sections/tables/TablesSection';
import { MealsSection } from '../../sections/meals/MealsSection';
import { ReservationsSection } from '../../sections/reservations/ReservationsSection';
import { RestaurantInfoSection } from '../../sections/restaurant-info/RestaurantInfoSection';
import { TerminalSection } from '../../sections/terminal/TerminalSection';

interface RestaurantDetailPageProps {
    restaurantId: number;
}

const TABS = [
    { id: 'info', label: 'Informations' },
    { id: 'tables', label: 'Tables' },
    { id: 'meals', label: 'Repas' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'terminal', label: 'Terminal' },
];

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({ restaurantId }) => {
    const router = useRouter();
    const { restaurant, activeTab, setActiveTab, isLoading } = useRestaurantDetail(restaurantId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-luxury-bg-primary flex items-center justify-center">
                <div className="text-luxury-gold">Chargement...</div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-luxury-bg-primary flex items-center justify-center">
                <div className="text-luxury-text-primary">Restaurant non trouve</div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <RestaurantInfoSection restaurant={restaurant} />;
            case 'tables':
                return <TablesSection restaurantId={restaurantId} />;
            case 'meals':
                return <MealsSection restaurantId={restaurantId} />;
            case 'reservations':
                return <ReservationsSection restaurantId={restaurantId} />;
            case 'terminal':
                return <TerminalSection restaurantId={restaurantId} />;
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-luxury-bg-primary">
            <div className="border-b border-luxury-gold-border">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <LuxuryButton
                                variant="secondary"
                                onClick={() => router.push('/admin')}
                            >
                                Retour
                            </LuxuryButton>
                            <div>
                                <h1 className="text-3xl font-serif text-luxury-text-primary">
                                    {restaurant.name}
                                </h1>
                                <p className="text-luxury-gold-muted">{restaurant.type}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-6">
                <LuxuryTabs
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            <div className="container mx-auto px-6 py-6">
                {renderTabContent()}
            </div>
        </main>
    );
};
