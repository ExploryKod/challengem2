import {useSummary} from "@taotask/modules/order/react/sections/summary/use-summary.hook";
import Image from "next/image";
import { Table } from 'lucide-react';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';

export const SummarySection = () => {
    const presenter = useSummary()

    return (
    <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down">
        <div className="flex flex-col mx-auto mb-5 w-full">
            <h3 className="mx-auto my-3 sm:my-5 pb-3 sm:pb-5 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl uppercase text-center tracking-wide">
                Votre réservation
            </h3>
            <div className="h-1 w-16 bg-luminous-gold mx-auto mb-6" />

            <div className="bg-luminous-bg-secondary border border-luminous-gold-border rounded-xl p-4 mx-auto max-w-[400px]">
                <p className='mb-2 font-display font-medium text-center text-base sm:text-lg text-luminous-text-primary'>
                    Emplacement de la table
                </p>
                <div className="flex justify-center mb-2">
                    <Table className="w-8 h-8 text-luminous-gold" />
                </div>
                <p className="text-sm sm:text-base italic text-center text-luminous-gold">
                    {presenter.summary.table.title}
                </p>
            </div>
        </div>

        <div className="flex flex-col mx-auto w-full max-w-75">
            <p className="mb-4 text-base sm:text-lg font-display font-medium text-center text-luminous-text-primary">
                Invités et leurs plats
            </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mx-auto my-3 w-full max-w-full sm:max-w-[85%]">
            {presenter.summary.guests.map((guest: any) => (
                <div key={guest.id} className="
                    relative flex flex-col justify-center items-center
                    border-2 border-luminous-gold-border hover:border-luminous-gold
                    bg-luminous-bg-card rounded-xl
                    mb-5 p-4 w-full sm:min-w-[280px] sm:basis-1/4
                    transition-all duration-200 shadow-[0_4px_20px_rgba(201,162,39,0.08)]
                ">
                    {guest.isOrganizer && (
                        <span className="block -top-3 left-3 absolute bg-luminous-gold px-3 py-1 rounded-full font-medium text-white text-xs uppercase tracking-wider">
                            Organisateur
                        </span>
                    )}

                    <div className="mt-4 mb-3">
                        <p className="font-display font-medium text-luminous-text-primary text-lg">{guest.name}</p>
                        {guest.menuTitle ? (
                            <span className="bg-luminous-gold/20 text-luminous-gold px-2 py-0.5 rounded text-xs">
                                {guest.menuTitle}
                            </span>
                        ) : (
                            <span className="bg-luminous-bg-secondary text-luminous-text-muted px-2 py-0.5 rounded text-xs">
                                A la carte
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col justify-center items-center grow gap-1">
                        {guest.meals.drink && guest.meals.drink.requiredAge !== null && guest.meals.drink.requiredAge >= 18 && guest.isOrganizer && (
                            <p className="my-2 text-center text-luminous-rose text-sm italic">
                                Eviter l&#39;alcool car vous organisez
                            </p>
                        )}
                        {guest.meals.entry && (
                            <p className="text-center text-luminous-text-secondary text-sm">
                                <span className="text-luminous-meal-entry font-medium">Entrée:</span> {guest.meals.entry.title}
                            </p>
                        )}
                        {guest.meals.mainCourse && (
                            <p className="text-center text-luminous-text-secondary text-sm">
                                <span className="text-luminous-meal-main font-medium">Plat:</span> {guest.meals.mainCourse.title}
                            </p>
                        )}
                        {guest.meals.dessert && (
                            <p className="text-center text-luminous-text-secondary text-sm">
                                <span className="text-luminous-meal-dessert font-medium">Dessert:</span> {guest.meals.dessert.title}
                            </p>
                        )}
                        <div className={`${guest.meals.drink && guest.meals.drink.requiredAge !== null && guest.meals.drink.requiredAge >= 18 ? "flex gap-2 items-center justify-center" : ""}`}>
                            {guest.isOrganizer && (guest.meals.drink && guest.meals.drink.requiredAge !== null && guest.meals.drink.requiredAge >= 18) && (
                                <Image src="/danger.svg" height={18} width={18} alt="warning" />
                            )}
                            {guest.meals.drink && (
                                <p className="text-center text-luminous-text-secondary text-sm">
                                    <span className="text-luminous-meal-drink font-medium">Boisson:</span> {guest.meals.drink.title}
                                </p>
                            )}
                        </div>
                        {!guest.meals.entry && !guest.meals.mainCourse && !guest.meals.dessert && !guest.meals.drink && (
                            <p className="text-center text-luminous-text-muted text-sm italic mt-2">
                                Aucune commande
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Price Total */}
        <div className="bg-luminous-bg-secondary border-2 border-luminous-gold rounded-xl p-4 mx-auto max-w-[400px] mt-6">
            <p className="text-center font-display font-medium text-lg text-luminous-text-primary mb-3">
                Recapitulatif
            </p>

            {/* Menu breakdown */}
            {Object.entries(presenter.priceBreakdown.menusByType).map(([menuName, data]) => (
                <div key={menuName} className="flex justify-between text-sm text-luminous-text-secondary mb-1">
                    <span>{data.count}x {menuName}</span>
                    <span>{(data.count * data.price).toFixed(2)} €</span>
                </div>
            ))}

            {/* A la carte */}
            {presenter.priceBreakdown.hasAlaCarte && (
                <div className="flex justify-between text-sm text-luminous-text-secondary mb-1">
                    <span>A la carte</span>
                    <span>{presenter.priceBreakdown.alaCarteTotal.toFixed(2)} €</span>
                </div>
            )}

            <div className="border-t border-luminous-gold-border my-2"></div>

            <div className="flex justify-between">
                <span className="font-medium text-luminous-text-primary">Total estime</span>
                <span className="text-xl font-bold text-luminous-gold">{presenter.totalPrice} €</span>
            </div>
            <p className="text-center text-xs text-luminous-text-muted mt-1 italic">
                (hors pourboire)
            </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mx-auto w-full mt-8">
            <LuminousButton
                onClick={presenter.onPrevious}
                variant="secondary"
            >
                Précédent
            </LuminousButton>
            <LuminousButton
                onClick={presenter.onNext}
                variant="primary"
            >
                Réserver
            </LuminousButton>
        </div>
    </LuminousCard>
    )
}
