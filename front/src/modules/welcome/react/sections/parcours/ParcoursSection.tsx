"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WelcomingDomainModel } from '@taotask/modules/welcome/core/model/welcoming.domain-model';

export const ParcoursSection: React.FC<{
    parcoursList: WelcomingDomainModel.ParcoursList,
    selectParcours: any,
}> = ({parcoursList, selectParcours}) => {

    return <section className={`w-full py-8 sm:py-[50px] mx-auto max-w-[1200px] rounded animate-fade-in-down 
                                shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
                                bg-[rgba(236,253,245,0.4)] hover:bg-[rgba(236,253,245,0.6)] px-4 sm:px-6
                                ${parcoursList.parcoursId ? "" : "" }`}>
                                
            <div className={`${parcoursList.parcoursId ? "hidden" : "block"} mx-auto mb-5 w-full flex`}>
                <h2 className="mx-auto my-3 text-lg sm:text-xl font-bold text-[#854854] text-center">
                    Choisissez un parcours dans la liste
                </h2>
            </div>
        <div className={`${parcoursList.parcoursId ? "" : "" } w-full mx-auto flex flex-col justify-center gap-2`}>
            <div className={`flex gap-3 justify-center items-center flex-wrap 
                ${parcoursList.parcoursId ? "hidden" : "" }`}>
                {parcoursList.parcours.length > 0 ? parcoursList.parcours
                .filter((parcours:WelcomingDomainModel.Parcours) => parcours.id)
                .map((parcours:WelcomingDomainModel.Parcours) => (
                    <div key={parcours.id} className="w-full sm:w-auto">
                        <ParcoursRows 
                        id={parcours.id.toString()}
                        parcours={parcours}
                        selectParcours={selectParcours}
                        selectedParcoursId={parcoursList.parcoursId ? parcoursList.parcoursId.toString() : ""}
                        />
                    </div>
                )) : <div className="my-5 mx-auto w-full sm:w-1/2 rounded px-5 py-2">
                        <p className="text-center font-semibold text-red-900 text-sm sm:text-base">Aucun restaurant n&apos;est disponible</p>
                    </div>}
        </div>
        <div className="w-full mx-auto flex justify-center gap-2">
                <div className="min-h-[30px]"> 
                    {parcoursList.parcours.length > 0 && parcoursList.parcoursId !== "" ? 
                    parcoursList.parcours.map((parcours: any) => {
                        return parcours.id === parcoursList.parcoursId && 
                            (<div className="my-5 mx-auto px-3 sm:px-5 py-3 sm:py-5 border-2 border-red-900 rounded"  key={parcours.id}>
                                <p className="text-center font-semibold text-red-900 text-sm sm:text-base whitespace-normal sm:whitespace-nowrap">
                                    Le parcours {parcours.title} vous souhaite la bienvenue</p>
                            </div>)
                        }
                    ): null}
                </div>
            </div>
        </div>
    </section>
}

const ParcoursRows: React.FC<{
    id: string,
    parcours: WelcomingDomainModel.Parcours,
    selectParcours: any,
    selectedParcoursId: string,
}> = ({id, parcours, selectParcours, selectedParcoursId}) => {
    const handleClick = () => {
        selectParcours(id);
    };

    return (
        <Link 
            href={parcours.link} 
            onClick={handleClick}
            className={`w-full sm:w-auto my-3 sm:my-5 mx-auto flex gap-2 block`}
        >
            <div className={`${selectedParcoursId === id ? "bg-red-700" : "bg-red-400"} cursor-pointer my-2 sm:my-5 mx-auto sm:mx-3 p-4 sm:p-5 w-full sm:min-w-[300px] rounded`}>
                <div className="flex flex-col gap-2 sm:gap-3 items-center justify-center">
                    <h3 className={`text-base sm:text-lg font-bold ${selectedParcoursId === id ? "text-orange-300" : "text-[#854854]"}`}>{parcours.image.title}</h3>
                    <p className={`text-base sm:text-lg font-bold  ${selectedParcoursId === id ? "text-orange-300" : "text-[#854854]"}`}>{parcours.text}</p>
                </div>
                <Image src={parcours.image.url} alt={parcours.image.alt} title={parcours.image.title} width={100} height={100} />
            </div>
        </Link>
    )
}