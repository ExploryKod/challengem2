"use client"
import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';

export const RestaurantSection: React.FC<{
    restaurantList: OrderingDomainModel.RestaurantList,
    selectRestaurant: any,
}> = ({restaurantList, selectRestaurant}) => {

    return <section className={`w-full py-8 sm:py-[50px] mx-auto max-w-[1200px] rounded animate-fade-in-down 
                                shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
                                bg-[rgba(236,253,245,0.4)] hover:bg-[rgba(236,253,245,0.6)] px-4 sm:px-6
                                ${restaurantList.restaurantId ? "" : "" }`}>
                                
            <div className={`${restaurantList.restaurantId ? "hidden" : "block"} mx-auto mb-5 w-full flex`}>
                <h2 className="mx-auto my-3 text-lg sm:text-xl font-bold text-[#854854] text-center">
                    Choisissez un restaurant dans la liste
                </h2>
            </div>
        <div className={`${restaurantList.restaurantId ? "" : "" } w-full mx-auto flex flex-col justify-center gap-2`}>
            <div className={`flex gap-3 justify-center items-center flex-wrap 
                ${restaurantList.restaurantId ? "hidden" : "" }`}>
                {restaurantList.restaurants.length > 0 ? restaurantList.restaurants
                .filter((restaurant:OrderingDomainModel.Restaurant) => restaurant.id)
                .map((restaurant:OrderingDomainModel.Restaurant) => (
                    <div key={restaurant.id} className="w-full sm:w-auto">
                        <RestaurantRows 
                        id={restaurant.id.toString()}
                        restaurantName={restaurant.restaurantName}
                        restaurantType={restaurant.restaurantType}
                        stars={restaurant.stars} 
                        selectRestaurant={selectRestaurant}
                        selectedRestaurantId={restaurantList.restaurantId ? restaurantList.restaurantId.toString() : ""}
                        />
                    </div>
                )) : <div className="my-5 mx-auto w-full sm:w-1/2 rounded px-5 py-2">
                        <p className="text-center font-semibold text-red-900 text-sm sm:text-base">Aucun restaurant n&apos;est disponible</p>
                    </div>}
        </div>
        <div className="w-full mx-auto flex justify-center gap-2">
                <div className="min-h-[30px]"> 
                    {restaurantList.restaurants.length > 0 && restaurantList.restaurantId !== "" ? 
                    restaurantList.restaurants.map((restaurant: any) => {
                        return restaurant.id === restaurantList.restaurantId && 
                            (<div className="my-5 mx-auto px-3 sm:px-5 py-3 sm:py-5 border-2 border-red-900 rounded"  key={restaurant.id}>
                                <p className="text-center font-semibold text-red-900 text-sm sm:text-base whitespace-normal sm:whitespace-nowrap">
                                    Le restaurant {restaurant.restaurantName} vous souhaite la bienvenue</p>
                            </div>)
                        }
                    ): null}
                </div>
            </div>
        </div>
    </section>
}

const RestaurantRows: React.FC<{
    id: string,
    selectedRestaurantId: string,
    restaurantName: string,
    restaurantType: string,
    stars: number,
    selectRestaurant: any,
}> = ({id, restaurantName,restaurantType, stars, selectRestaurant, selectedRestaurantId}) => {
    console.log("selectedRestaurantId", selectedRestaurantId)
    return (
    
    <div onClick={() => selectRestaurant(id)} className={`w-full sm:w-auto my-3 sm:my-5 mx-auto flex gap-2`} >
            <div className={`${selectedRestaurantId === id ? "bg-red-700" : "bg-red-400"} cursor-pointer my-2 sm:my-5 mx-auto sm:mx-3 p-4 sm:p-5 w-full sm:min-w-[300px] rounded`}>
                <div className="flex flex-col gap-2 sm:gap-3 items-center justify-center">
                    <h3 className={`text-base sm:text-lg font-bold ${selectedRestaurantId === id ? "text-orange-300" : "text-[#854854]"}`}>{restaurantName}</h3>
                    <p className={`text-base sm:text-lg font-bold  ${selectedRestaurantId === id ? "text-orange-300" : "text-[#854854]"}`}>{restaurantType}</p>
                    <ul className="flex gap-1 sm:gap-2">
                        {stars > 0  && stars < 7 ? [...Array(stars)].map((e, i) => <li key={i} className="text-base sm:text-lg font-bold text-[#854854]">⭐</li>) : null}
                    </ul>
                </div>
            </div>
    </div>
    )
}