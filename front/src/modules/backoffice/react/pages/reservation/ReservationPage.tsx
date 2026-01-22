'use client';
import React from 'react';
import { ReservationsSection } from '@taotask/modules/backoffice/react/sections/reservations/ReservationsSection';

interface ReservationPageProps {
    restaurantId?: number;
}

export const ReservationPage: React.FC<ReservationPageProps> = ({ restaurantId }) => {
    // If no restaurantId is provided, show a placeholder message
    if (!restaurantId) {
        return (
            <main className="min-h-screen bg-luxury-bg-primary flex items-center justify-center">
                <div className="text-luxury-text-secondary">
                    Selectionnez un restaurant pour voir ses reservations
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col">
            <ReservationsSection restaurantId={restaurantId} />
        </main>
    );
};
