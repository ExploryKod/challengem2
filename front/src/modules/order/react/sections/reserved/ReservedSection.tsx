import { useReserved } from './use-reserved.hook';

export const ReservedSection = () => {
    const presenter = useReserved();


    return (<>
      <section className="bg-[rgba(236,253,245,0.4)] hover:bg-[rgba(236,253,245,0.6)] shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] mx-auto py-8 sm:py-[50px] rounded w-full max-w-[1200px] animate-fade-in-down px-4 sm:px-6">
        <div className="flex flex-col mx-auto mb-5 w-full">
            <h3 className="mx-auto my-3 font-bold text-[#854854] text-base sm:text-lg text-center">Merci pour votre réservation</h3>  
        </div>

        <div className="flex flex-col mx-auto mb-5">
            <div className="border-[#6A4A38] border-2 mx-auto px-4 sm:px-9 py-4 sm:py-6 border rounded w-full max-w-[600px]">
                <p className={`mb-2 text-sm sm:text-md text-center text-[#6A4A38]`}>En réservant chez nous, vous pouvez vous attendre à un service de qualité et à un restaurant convivial.</p>
                <p className={`mb-2 text-sm sm:text-md text-center text-[#6A4A38]`}>Notre équipe met tout en oeuvre pour vous offrir une expérience culinaire exceptionnelle.</p>
                <p className={`mb-2 text-sm sm:text-md text-center text-[#6A4A38]`}>Nous vous remercions de votre confiance et nous espérons vous revoir bientôt.</p>
            </div>
        </div>
       
       <div className="flex flex-col sm:flex-row justify-center gap-2 mx-auto w-full">
            <button
            onClick={presenter.onNewTable}
            type="button"
            className="inline-block disabled:border-gray-200 bg-[#458236] hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 disabled:bg-gray-500 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:shadow-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs disabled:text-gray-50 uppercase leading-normal transition duration-150 ease-in-out focus:outline-none">
            Nouvelle réservation
            </button>
            <a
            href="/"
            className="inline-block disabled:border-gray-200 bg-[#458236] hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 disabled:bg-gray-500 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:shadow-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs disabled:text-gray-50 uppercase leading-normal transition duration-150 ease-in-out focus:outline-none text-center">
            Retour Accueil
            </a>
        </div>
    </section>
    </>)
}