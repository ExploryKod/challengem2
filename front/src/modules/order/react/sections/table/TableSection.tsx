import { useTable } from '@taotask/modules/order/react/sections/table/use-table.hook';

export const TableSection = () => {
    const presenter = useTable();
    
    return (<>    
    <section className="
    w-full py-8 sm:py-[50px] mx-auto max-w-[1200px] px-4 sm:px-6
    bg-[rgba(236,253,245,0.4)] hover:bg-[rgba(236,253,245,0.6)] 
    rounded animate-fade-in-down shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
        <div className="mx-auto mb-5 w-full flex flex-col">
            <h3 className="mx-auto my-3 text-base sm:text-lg font-bold text-[#854854] text-center">Choix de votre table:</h3>  
        </div>
        <div className={`flex gap-3 justify-center items-center flex-wrap`}>
       {presenter.availableTables.length > 0 
       && presenter.availableTables.map((table: any) => 
              (
              <div key={table.id} className="w-full sm:w-auto">
                <TableCard 
                title={table.title} 
                capacity={table.capacity}
                isSelected={presenter.assignTableId === table.id} 
                onSelect={() => presenter.assignTable(table.id)} 
                />
              </div>
              ))}
        </div>
       <div className="w-full mx-auto flex flex-col sm:flex-row justify-center gap-2">
            <button
            onClick={presenter.onPrevious}
            type="submit"
            className="inline-block rounded bg-[#458236] px-4 sm:px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white 
            shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
            focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
            focus:outline-none focus:ring-0 
            active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
            dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
            dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
            Précèdent
            </button>
            <button
            onClick={presenter.onNext}
            disabled={presenter.isSubmittable === false}
            type="button"
            className="inline-block rounded bg-[#458236] px-4 sm:px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white 
            shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 
            disabled:bg-gray-500 disabled:text-gray-50 disabled:border-gray-200 disabled:shadow-none
            hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
            focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 
            active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
            dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
            dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
            dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
            Suivant
            </button>
        </div>
    </section>
    </>)
}

export const TableCard: React.FC<{
    title: string,
    capacity: number,
    isSelected: boolean,
    onSelect: () => void,
}> = ({title, capacity, isSelected, onSelect}) => {
    
    return (
    <div onClick={onSelect} className={`w-full sm:w-auto my-3 sm:my-5 mx-auto flex gap-2`} >
            <div className={`${isSelected ? "bg-red-700" : "bg-red-400"} cursor-pointer my-2 sm:my-5 mx-auto sm:mx-3 p-4 sm:p-5 w-full sm:min-w-[300px] rounded`}>
                <div className="flex flex-col gap-2 sm:gap-3 items-center justify-center">
                    <h3 className={`text-base sm:text-lg font-bold ${isSelected ? "text-orange-300" : "text-[#854854]"}`}>{title}</h3>
                    <ul className="flex gap-1 sm:gap-2">
                        {capacity ? [...Array(capacity)].map((seat, i) => <li key={i} className="text-base sm:text-lg font-bold text-[#854854]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isSelected ? "#FFA500" : "#854854"} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-user-round sm:w-6 sm:h-6 w-5 h-5">
                            <circle cx="12" cy="8" r="5"/>
                            <path d="M20 21a8 8 0 0 0-16 0"/>
                        </svg>
                        </li>) : null}
                    </ul>
                </div>
            </div>
    </div>
    )
}