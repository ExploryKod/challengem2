'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, AppState } from '@taotask/modules/store/store';
import { terminalActions } from '../../../core/store/terminal.slice';
import { lookupReservation } from '../../../core/useCase/lookup-reservation.usecase';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';
import { LuminousInput } from '@taotask/modules/order/react/components/ui/LuminousInput';
import { ArrowLeft, Users, QrCode, Loader2 } from 'lucide-react';

export const IdentifySection: React.FC = () => {
    const dispatch = useAppDispatch();
    const identifyMode = useSelector((state: AppState) => state.terminal.identifyMode);
    const error = useSelector((state: AppState) => state.terminal.error);
    const lookupStatus = useSelector((state: AppState) => state.terminal.lookupStatus);

    const [reservationCode, setReservationCode] = useState('');
    const [guestCount, setGuestCount] = useState(2);

    const isLoading = lookupStatus === 'loading';

    const handleBack = () => {
        dispatch(terminalActions.reset());
    };

    const handleReservationSubmit = async () => {
        if (!reservationCode.trim()) {
            dispatch(terminalActions.setError('Veuillez entrer votre code de reservation'));
            return;
        }

        dispatch(lookupReservation(reservationCode.toUpperCase()));
    };

    const handleWalkInSubmit = () => {
        if (guestCount < 1) {
            dispatch(terminalActions.setError('Le nombre de convives doit etre au moins 1'));
            return;
        }

        dispatch(terminalActions.setGuestCount(guestCount));
        dispatch(terminalActions.goToConfirmation());
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <LuminousCard className="max-w-lg w-full py-12 px-8">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-luminous-text-secondary hover:text-luminous-gold transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                </button>

                {identifyMode === 'reservation' ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-luminous-gold/10 flex items-center justify-center mx-auto mb-4">
                                <QrCode className="w-8 h-8 text-luminous-gold" />
                            </div>
                            <h2 className="text-2xl font-display font-medium text-luminous-text-primary mb-2">
                                Entrez votre code
                            </h2>
                            <p className="text-luminous-text-secondary">
                                Le code figure sur votre email de confirmation
                            </p>
                        </div>

                        <div className="space-y-6">
                            <LuminousInput
                                label="Code de reservation"
                                name="reservationCode"
                                value={reservationCode}
                                onChange={(e) => {
                                    setReservationCode(e.target.value.toUpperCase());
                                    dispatch(terminalActions.clearError());
                                }}
                                placeholder="ABC123"
                            />

                            {error && (
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            )}

                            <LuminousButton
                                variant="primary"
                                onClick={handleReservationSubmit}
                                className="w-full py-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Recherche...
                                    </span>
                                ) : (
                                    'Valider'
                                )}
                            </LuminousButton>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-luminous-gold/10 flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-luminous-gold" />
                            </div>
                            <h2 className="text-2xl font-display font-medium text-luminous-text-primary mb-2">
                                Combien etes-vous ?
                            </h2>
                            <p className="text-luminous-text-secondary">
                                Indiquez le nombre de convives
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-center gap-6">
                                <button
                                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                    className="w-14 h-14 rounded-full border-2 border-luminous-gold text-luminous-gold text-2xl font-medium hover:bg-luminous-gold hover:text-luminous-bg-primary transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-5xl font-display text-luminous-text-primary w-20 text-center">
                                    {guestCount}
                                </span>
                                <button
                                    onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                                    className="w-14 h-14 rounded-full border-2 border-luminous-gold text-luminous-gold text-2xl font-medium hover:bg-luminous-gold hover:text-luminous-bg-primary transition-colors"
                                >
                                    +
                                </button>
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            )}

                            <LuminousButton
                                variant="primary"
                                onClick={handleWalkInSubmit}
                                className="w-full py-4"
                            >
                                Continuer
                            </LuminousButton>
                        </div>
                    </>
                )}
            </LuminousCard>
        </div>
    );
};
