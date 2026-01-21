import {OrderingDomainModel} from '@taotask/modules/order/core/model/ordering.domain-model';
import {useSummary} from "@taotask/modules/order/react/sections/summary/use-summary.hook";
import Image from "next/image"
export const SummarySection = () => {
    const presenter = useSummary()

    return (<>
      <section className="bg-[rgba(236,253,245,0.4)] hover:bg-[rgba(236,253,245,0.6)] shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] mx-auto py-8 sm:py-[50px] rounded w-full max-w-[1200px] animate-fade-in-down px-4 sm:px-6">
        <div className="flex flex-col mx-auto mb-5 w-full">
            <h3 className="mx-auto my-3 sm:my-5 pb-3 sm:pb-5 font-bold text-[#854854] text-lg sm:text-xl uppercase text-center">Votre réservation</h3>
                <p className='mb-2 font-bold text-center text-base sm:text-lg text-red-900'>Emplacement de la table</p>
                <p className={`mb-2 text-sm sm:text-md italic text-center text-orange-900`}>{presenter.summary.table.title}</p>
        </div>

        <div className="flex flex-col mx-auto w-full max-w-75">
            <p className={`mb-2 text-base sm:text-lg font-bold text-center text-red-900`}>Invités et leurs plats:</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mx-auto my-3 w-full max-w-full sm:max-w-[75%]">
            {presenter.summary.guests.map((guest: any) => (
              <div key={guest.id} className={`
                relative flex flex-col justify-center items-center border-[#458236] border-1 
                mb-5 p-3 border rounded w-full sm:min-w-[300px] sm:basis-1/4`}>
                    {guest.isOrganizer ? 
                   <span className="block -top-2 left-2 absolute border-[#458236] border-1 bg-[#F9EC7E] px-2.5 py-0.5 border rounded font-medium text-green-900 text-sm">J&#39;organise</span>: null}
                 
                  <div className="mt-5 mb-3">
                    <p className="text-orange-900">{guest.name}</p>
                  </div>
                  <div className={`flex flex-col justify-center items-center grow`}>
                    <p className="my-3 text-center text-yellow-900 italic">{guest.meals.drink && guest.meals.drink.requiredAge !== null && guest.meals.drink.requiredAge >= 18 && guest.isOrganizer ? "Eviter l'alcool car vous organisez" : null}</p>
                    <p className="text-center text-yellow-900">{guest.meals.entry ? guest.meals.entry.title : null}</p>
                    <p className="text-center text-yellow-900">{guest.meals.mainCourse ? guest.meals.mainCourse.title : null}</p>
                    <p className="text-center text-yellow-900">{guest.meals.dessert ? guest.meals.dessert.title : null}</p>
                    <div className={`${guest.meals.drink && guest.meals.drink.requiredAge !== null && guest.meals.drink.requiredAge >= 18 ? "flex gap-3 items-center justify-center" : ""}`}>
                    {guest.isOrganizer && (guest.meals.drink && guest.meals.drink.requiredAge !== null && guest.meals.drink.requiredAge >= 18) ? <Image src="/danger.svg" height={18} width={18} alt="" /> : null}
                    <p className="text-center text-yellow-900">{guest.meals.drink ? 
                        guest.meals.drink.title 
                        : null}</p>
                    </div>
                    {!guest.meals.entry && !guest.meals.mainCourse && !guest.meals.dessert && !guest.meals.drink ? 
                      (<p className="text-center text-yellow-900">Vous ne mangez rien ?</p>) : null}
                  </div>
              
              </div>
          ))}
        </div>
          
       
       <div className="flex flex-col sm:flex-row justify-center gap-2 mx-auto w-full">
            <button
            onClick={presenter.onPrevious}
            type="submit"
            className="inline-block bg-[#458236] hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs uppercase leading-normal transition duration-150 ease-in-out focus:outline-none">
            Précèdent
            </button>
            <button
            onClick={presenter.onNext}
            type="button"
            className="inline-block disabled:border-gray-200 bg-[#458236] hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 disabled:bg-gray-500 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:shadow-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs disabled:text-gray-50 uppercase leading-normal transition duration-150 ease-in-out focus:outline-none">
            Réserver
            </button>
        </div>
    </section>
    </>)
}
