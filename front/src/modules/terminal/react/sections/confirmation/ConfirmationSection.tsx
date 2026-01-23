'use client';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, AppState } from '@taotask/modules/store/store';
import { terminalActions } from '../../../core/store/terminal.slice';
import { TerminalDomainModel } from '../../../core/model/terminal.domain-model';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { CheckCircle, UtensilsCrossed } from 'lucide-react';

export const ConfirmationSection: React.FC = () => {
    const dispatch = useAppDispatch();
    const reservation = useSelector((state: AppState) => state.terminal.reservation);
    const guestCount = useSelector((state: AppState) => state.terminal.guestCount);
    const identifyMode = useSelector((state: AppState) => state.terminal.identifyMode);

    const hasPreOrders = reservation ? TerminalDomainModel.hasPreOrders(reservation) : false;

    // Auto-reset after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(terminalActions.reset());
        }, 10000);

        return () => clearTimeout(timer);
    }, [dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <LuminousCard className="max-w-lg w-full text-center py-12 px-8">
                <div className="w-20 h-20 rounded-full bg-luminous-sage/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-luminous-sage" />
                </div>

                <h1 className="text-2xl font-display font-medium text-luminous-text-primary mb-4">
                    Un membre de notre equipe va vous accueillir
                </h1>
                <div className="h-1 w-16 bg-luminous-gold mx-auto mb-6" />

                {identifyMode === 'reservation' && reservation && (
                    <div className="bg-luminous-bg-secondary border border-luminous-gold-border rounded-xl p-4 mb-6">
                        <p className="text-luminous-text-secondary text-sm">
                            {reservation.guests.length} convive{reservation.guests.length > 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {identifyMode === 'reservation' && hasPreOrders && (
                    <div className="bg-luminous-bg-secondary border border-luminous-gold-border rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <UtensilsCrossed className="w-5 h-5 text-luminous-gold" />
                            <p className="text-luminous-gold text-sm font-medium">
                                Commandes pre-enregistrees
                            </p>
                        </div>
                        <p className="text-luminous-text-secondary text-xs">
                            Vos plats ont ete enregistres et seront prepares a votre arrivee
                        </p>
                    </div>
                )}

                {identifyMode === 'walkin' && (
                    <div className="bg-luminous-bg-secondary border-2 border-luminous-gold rounded-xl p-6 mb-6">
                        <p className="text-luminous-text-secondary text-sm mb-2">
                            Nombre de convives
                        </p>
                        <p className="text-4xl font-bold text-luminous-gold">
                            {guestCount}
                        </p>
                    </div>
                )}

                <p className="text-luminous-text-muted text-sm">
                    Cette page se reinitialise automatiquement
                </p>
            </LuminousCard>
        </div>
    );
};
