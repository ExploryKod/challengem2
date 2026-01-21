"use client"
import React from 'react';
import { ReservationsSection } from '@taotask/modules/backoffice/react/sections/reservations/ReservationsSection';
    
export const ReservationPage: React.FC = () => {
    return (
        <main className="flex flex-col">

            <ReservationsSection />
        </main>
    );
};
