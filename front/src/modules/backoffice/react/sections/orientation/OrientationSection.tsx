"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

export const OrientationSection: React.FC = () => {
    const router = useRouter();

    return <section className={`hero-section-minh relative overflow-hidden bg-cover bg-no-repeat custom-parcours-bg bg-[#458236]`}>
        <div
        className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-[hsla(0,0%,0%,0.75)] bg-fixed">
         <div className="flex h-full items-center justify-center">
                <div className="py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-12 text-center text-white bg-black/80 rounded-lg">
                    <h1 className={`title mt-2 mb-8 sm:mb-12 md:mb-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight sm:leading-normal`}>
                        Choisir une action
                    </h1>

                    <div className={`w-full mx-auto flex flex-col justify-center gap-2`}>
                        <div className={`flex gap-3 justify-center items-center flex-wrap`}>
                     
                        <button type="button"
                            onClick={() => router.push('/admin/manage-restaurants')}
                            className="button w-full font-mono rounded border-2 border-gray-50 px-6 sm:px-[46px] pt-3 sm:pt-[14px] pb-2.5 sm:pb-[12px] 
                            text-xs sm:text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out 
                            hover:border-gray-100 hover:bg-gray-100 hover:bg-opacity-10 hover:text-gray-100 
                            focus:border-gray-100 focus:text-gray-100 focus:outline-none focus:ring-0 
                            active:border-gray-200 active:text-gray-200"
                            data-te-ripple-init data-te-ripple-color="light">
                           Gérer les restaurants
                        </button>
                        <button type="button"
                            onClick={() => router.push('/admin/manage-reservations')}
                            className="button w-full font-mono rounded border-2 border-gray-50 px-6 sm:px-[46px] pt-3 sm:pt-[14px] pb-2.5 sm:pb-[12px] 
                            text-xs sm:text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out 
                            hover:border-gray-100 hover:bg-gray-100 hover:bg-opacity-10 hover:text-gray-100 
                            focus:border-gray-100 focus:text-gray-100 focus:outline-none focus:ring-0 
                            active:border-gray-200 active:text-gray-200"
                            data-te-ripple-init data-te-ripple-color="light">
                           Gérer les réservations
                        </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
  </section>  
}