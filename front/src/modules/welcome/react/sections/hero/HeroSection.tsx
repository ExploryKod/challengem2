"use client";
import { useHeroSection } from '@taotask/modules/welcome/react/sections/hero/use-hero-section';
import { useRouter } from 'next/navigation';
import { DocumentationPopup } from '@taotask/modules/welcome/react/components/DocumentationPopup';

export const HeroSection: React.FC = () => {
    const { font: fontFamily } = useHeroSection();
    const router = useRouter();

    const handleDiscover = () => {
        router.push('/order');
    };

    const handleGoToDoc = () => {
        router.push('/docs');
    };

    const handleGoToAdmin = () => {
        router.push('/admin');
    };

    return (
        <section className="hero-section-minh relative overflow-hidden bg-cover bg-no-repeat custom-hero-bg bg-luxury-bg-primary">
            <DocumentationPopup />

            <button
                type="button"
                onClick={handleGoToAdmin}
                className="absolute top-4 right-4 z-10 font-mono rounded border border-luxury-gold/60 px-4 py-2
                    text-xs font-medium uppercase tracking-wider text-luxury-gold transition duration-150 ease-in-out
                    hover:border-luxury-gold hover:bg-luxury-gold/10
                    focus:outline-none focus:ring-1 focus:ring-luxury-gold"
            >
                Admin
            </button>

            <div
                className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-[hsla(0,0%,0%,0.7)] bg-fixed">
                <div className="flex h-full items-center justify-center">
                    <div className="px-4 sm:px-6 md:px-12 text-center text-luxury-text-primary">
                        <h1 className={`${fontFamily} opacity-0 title mt-2 mb-4 sm:mb-6 md:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight sm:leading-normal`}>
                            Taste Federation
                        </h1>
                        <div className="subtitle opacity-0 bg-luxury-bg-secondary/70 border border-luxury-gold-border/60 backdrop-blur-sm max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4 py-3 rounded-lg">
                            <p className="text-[14px] leading-relaxed text-luxury-text-primary">
                                Taste Federation se donne pour but de rendre accessible en ligne la réservation auprés d&apos;un ensemble de restaurants de luxe parmis les meilleurs de France. Le Hub est basé dans le Mas des Alouettes en Provence au coeur d&apos;un écrin de verdure au{" "}
                                <span className="font-semibold">18 route de Senanque sur la D177 prés de Sorgues</span>.
                            </p>
                            <p className="text-[14px] leading-relaxed text-luxury-text-primary">
                                Site de démonstration : les données sont fictives. Le backoffice et l'api n'est pas toujours disponible.
                            </p>
                            <a
                                className="mt-2 block text-center text-xs sm:text-sm text-luxury-gold underline underline-offset-4 hover:text-luxury-gold/80"
                                href="https://www.google.com/maps?q=43.919815818174385,5.193920727116252"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Ouvrir dans Google Maps
                            </a>
                        </div>
                        <div className="button opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto w-fit">
                            <button type="button"
                                onClick={handleDiscover}
                                className="font-mono rounded border-2 border-luxury-gold px-6 sm:px-[46px] pt-3 sm:pt-[14px] pb-2.5 sm:pb-[12px]
                                text-xs sm:text-sm font-medium uppercase leading-normal text-luxury-gold transition duration-150 ease-in-out
                                hover:border-luxury-gold hover:bg-luxury-gold/10 hover:text-luxury-gold
                                focus:border-luxury-gold focus:text-luxury-gold focus:outline-none focus:ring-0
                                active:border-luxury-gold/80 active:text-luxury-gold"
                                data-te-ripple-init data-te-ripple-color="light">
                                Découvrir
                            </button>
                            <button type="button"
                                onClick={handleGoToDoc}
                                className="font-mono rounded border-2 border-luxury-gold bg-luxury-gold px-6 sm:px-[46px] pt-3 sm:pt-[14px] pb-2.5 sm:pb-[12px]
                                text-xs sm:text-sm font-bold uppercase leading-normal text-luxury-bg-primary transition duration-150 ease-in-out
                                hover:bg-luxury-gold/90 hover:shadow-lg hover:shadow-luxury-gold/20
                                focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:ring-offset-2 focus:ring-offset-luxury-bg-primary
                                active:bg-luxury-gold/80"
                                data-te-ripple-init data-te-ripple-color="dark">
                                Documentation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
