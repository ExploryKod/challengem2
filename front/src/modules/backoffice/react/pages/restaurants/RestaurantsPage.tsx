"use client"
import React from 'react';
import { RestaurantsSection } from '@taotask/modules/backoffice/react/sections/restaurants/RestaurantsSection';
    
export const RestaurantsPage: React.FC = () => {
    return (
        <main className="flex flex-col">

            <RestaurantsSection />
        </main>
    );
};
