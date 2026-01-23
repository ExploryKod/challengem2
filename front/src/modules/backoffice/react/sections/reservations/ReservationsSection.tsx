'use client';
import React from 'react';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { useReservations } from './use-reservations.hook';

interface ReservationsSectionProps {
    restaurantId: number;
}

export const ReservationsSection: React.FC<ReservationsSectionProps> = ({ restaurantId }) => {
    const { reservations, isLoading, deleteReservation, getTableTitle } = useReservations(restaurantId);

    const handleDelete = async (reservationId: number) => {
        if (confirm('Etes-vous sur de vouloir supprimer cette reservation ?')) {
            await deleteReservation(reservationId);
        }
    };

    if (isLoading) {
        return <div className="text-luxury-gold">Chargement des reservations...</div>;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-text-primary">
                    Reservations ({reservations.length})
                </h2>
            </div>

            {reservations.length === 0 ? (
                <div className="text-center py-12 text-luxury-text-secondary">
                    Aucune reservation pour ce restaurant.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reservations.map((reservation) => (
                        <LuxuryCard key={reservation.id}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-luxury-text-primary">
                                        {getTableTitle(reservation.tableId)}
                                    </h3>
                                    <p className="text-luxury-gold-muted text-sm">
                                        {formatDate(reservation.createdAt)}
                                    </p>
                                </div>
                                <span className="bg-luxury-gold/20 text-luxury-gold px-2 py-1 rounded text-sm">
                                    {reservation.guests.length} {reservation.guests.length > 1 ? 'convives' : 'convive'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm text-luxury-gold-muted uppercase tracking-wider mb-2">
                                    Convives
                                </h4>
                                <ul className="space-y-1">
                                    {reservation.guests.map((guest, index) => (
                                        <li key={index} className="text-luxury-text-primary text-sm">
                                            {guest.firstName} {guest.lastName}
                                            {guest.isOrganizer && (
                                                <span className="text-luxury-gold ml-2">(Organisateur)</span>
                                            )}
                                            <span className="text-luxury-text-secondary ml-2">
                                                ({guest.age} ans)
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-2">
                                <LuxuryButton
                                    variant="destructive"
                                    onClick={() => handleDelete(reservation.id)}
                                >
                                    Supprimer
                                </LuxuryButton>
                            </div>
                        </LuxuryCard>
                    ))}
                </div>
            )}
        </div>
    );
};
