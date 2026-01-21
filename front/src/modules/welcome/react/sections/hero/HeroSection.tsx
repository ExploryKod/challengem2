"use client";
import { useHeroSection } from '@taotask/modules/welcome/react/sections/hero/use-hero-section';

export const HeroSection: React.FC<{showParcoursSection: any}> = ({showParcoursSection}) => {
    const presenter:any = useHeroSection();
    const fontFamily = presenter.font;
    const city='de Provence';

    return (
    <section className={`hero-section-minh relative overflow-hidden bg-cover bg-no-repeat custom-hero-bg bg-[#458236]`}>
        <div
        className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-[hsla(0,0%,0%,0.75)] bg-fixed">
         <div className="flex h-full items-center justify-center">
                <div className="px-4 sm:px-6 md:px-12 text-center text-white">
                    <h1 className={`${fontFamily} opacity-0 title mt-2 mb-8 sm:mb-12 md:mb-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight sm:leading-normal`}>
                        Les plus belle tables {city}<br /><span className="text-[#485] square">La perfection du goût</span>
                    </h1>
                    <button type="button"
                        onClick={showParcoursSection}
                        className="button opacity-0 font-mono rounded border-2 border-gray-50 px-6 sm:px-[46px] pt-3 sm:pt-[14px] pb-2.5 sm:pb-[12px] 
                        text-xs sm:text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out 
                        hover:border-gray-100 hover:bg-gray-100 hover:bg-opacity-10 hover:text-gray-100 
                        focus:border-gray-100 focus:text-gray-100 focus:outline-none focus:ring-0 
                        active:border-gray-200 active:text-gray-200"
                        data-te-ripple-init data-te-ripple-color="light">
                        Réserver une table
                    </button>
                </div>
            </div>
        </div>
  </section>
  )
}