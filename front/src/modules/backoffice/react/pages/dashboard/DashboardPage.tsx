"use client"
import React from 'react';
import { OrientationSection } from '../../sections/orientation/OrientationSection';

export const DashboardPage: React.FC = () => {
    return (
        <main className="flex flex-col">

            <OrientationSection />
        </main>
    );
};
