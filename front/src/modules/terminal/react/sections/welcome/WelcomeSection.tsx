'use client';
import React from 'react';
import { useAppDispatch } from '@taotask/modules/store/store';
import { terminalActions } from '../../../core/store/terminal.slice';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';

export const WelcomeSection: React.FC = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <LuminousCard className="max-w-lg w-full text-center py-12 px-8">
                <h1 className="text-3xl font-display font-medium text-luminous-text-primary mb-4">
                    Bienvenue
                </h1>
                <div className="h-1 w-16 bg-luminous-gold mx-auto mb-6" />
                <p className="text-luminous-text-secondary mb-8">
                    Avez-vous une reservation ?
                </p>

                <div className="flex flex-col gap-4">
                    <LuminousButton
                        variant="primary"
                        onClick={() => dispatch(terminalActions.chooseReservationMode())}
                        className="w-full py-4 text-lg"
                    >
                        J'ai une reservation
                    </LuminousButton>
                    <LuminousButton
                        variant="secondary"
                        onClick={() => dispatch(terminalActions.chooseWalkInMode())}
                        className="w-full py-4 text-lg"
                    >
                        Sans reservation
                    </LuminousButton>
                </div>
            </LuminousCard>
        </div>
    );
};
