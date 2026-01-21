"use client";
import React from 'react';
import { useGuestSection } from "@taotask/modules/order/react/sections/guest/use-guest-section";
import { Button } from "flowbite-react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Checkbox } from "@material-tailwind/react";
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';

export const GuestSection: React.FC<{restaurantList: OrderingDomainModel.RestaurantList}> = ({restaurantList}) => {
    const presenter:any = useGuestSection();


    return <section className="bg-[rgba(236,253,245,0.4)] hover:bg-[rgba(236,253,245,0.6)] shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] mx-auto py-8 sm:py-[50px] rounded w-full max-w-[1200px] animate-fade-in-down px-4 sm:px-6">
        <div className="flex flex-col mx-auto mb-5 w-full">
        {restaurantList.restaurantId ? 
            <h2 className="mx-auto my-3 font-bold text-[#854854] text-lg sm:text-xl text-center">
            Qui voulez-vous inviter&nbsp;&quot;{restaurantList.restaurants
            .filter((restaurant:OrderingDomainModel.Restaurant) => restaurant.id === restaurantList.restaurantId)[0].restaurantName}&quot;&nbsp;?
            </h2> : 
            <h2 className="mx-auto my-3 font-bold text-[#854854] text-lg sm:text-xl text-center">Pour inviter, choisissez un restaurant</h2>}
            <span className="mx-auto my-2 text-[#854854] text-sm sm:text-md italic text-center">Pour des raisons de sécurité, choississez obligatoirement au moins un capitaine de soirée&nbsp;: l&#39;organisateur.</span>
            <span className="mx-auto my-2 text-[#854854] text-sm sm:text-md italic text-center">L&#39;organisateur est la personne qui ne boit pas et se charge du déplacement des invités.</span>
        </div>
        {restaurantList.restaurantId && presenter.form.guests.map((guest:any) => (
            <div key={guest.id}>
                <GuestRows 
                id={guest.id}
                firstName={guest.firstName}
                lastName={guest.lastName}
                age={guest.age} 
                onChange={presenter.updateGuest}
                remove={presenter.removeGuest}
                changeOrganizer={presenter.changeOrganizer}
                isOrganizer={guest.id === presenter.form.organizerId}
                checkboxRef={presenter.checkBoxOrganizer}
                />
            </div>
        ))}
       
       <div ref={presenter.bottomGuestRef} className="flex flex-col sm:flex-row justify-center gap-2 mx-auto w-full">
            <button
            onClick={presenter.addGuest}
            type="submit"
            className="inline-block bg-[#458236] hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs uppercase leading-normal transition duration-150 ease-in-out focus:outline-none">
            Inviter une personne
            </button>
            <button
            onClick={presenter.onNext}
            disabled={presenter.isSubmitable === false}
            type="button"
            className="inline-block disabled:border-gray-200 bg-[#458236] hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 disabled:bg-gray-500 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:shadow-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs disabled:text-gray-50 uppercase leading-normal transition duration-150 ease-in-out focus:outline-none">
            Suivant
            </button>
        </div>
    </section>
}


const GuestRows: React.FC<{
    id: string | number,
    firstName: string,
    lastName: string,
    age: number,
    isOrganizer: boolean,
    onChange: <T extends keyof OrderingDomainModel.Guest>
        (id:string | number, 
        key:T, 
        value: OrderingDomainModel.Guest[T]
        ) => void,
    remove: (id:string | number) => void,
    changeOrganizer: (id:string | number) => void
    checkboxRef: any
}> = ({id,firstName,lastName, age, onChange, remove, changeOrganizer, isOrganizer, checkboxRef}) => {

    return (
    <div className="flex md:flex-row flex-col justify-center gap-2 mx-auto my-5">
        
            <div className="relative flex flex-col justify-center items-center">
                <label className="block">
                    <span className="block font-medium text-slate-700 text-sm">Prénom</span>
                        <input type="text" 
                        id="firstName"
                        placeholder="Andrew"
                        className="block border-slate-300 focus:border-sky-500 focus:invalid:border-pink-500 disabled:border-slate-200 invalid:border-pink-500 bg-white disabled:bg-slate-50 shadow-sm disabled:shadow-none mt-1 px-3 py-2 border rounded-md focus:ring-1 focus:ring-sky-500 focus:invalid:ring-pink-500 w-full text-sm disabled:text-slate-500 invalid:text-pink-600 placeholder-slate-400 focus:outline-none"
                        onChange= {(e) => onChange(id, 'firstName', e.target.value)} 
                   
                        />
                </label>
            </div>

            <div className="relative flex flex-col justify-center items-center">
                <label className="block">
                    <span className="block font-medium text-slate-700 text-sm">Nom</span>
                        <input type="text" 
                        id="lastName"
                        placeholder="Collins"
                        className="block border-slate-300 focus:border-sky-500 focus:invalid:border-pink-500 disabled:border-slate-200 invalid:border-pink-500 bg-white disabled:bg-slate-50 shadow-sm disabled:shadow-none mt-1 px-3 py-2 border rounded-md focus:ring-1 focus:ring-sky-500 focus:invalid:ring-pink-500 w-full text-sm disabled:text-slate-500 invalid:text-pink-600 placeholder-slate-400 focus:outline-none"
                        min="0"
                        onChange= {(e) => onChange(id, "lastName", e.target.value)} 
                      
                        />
                </label>
            </div>

            <div className="relative flex flex-col justify-center items-center">
                <label className="block">
                    <span className="block font-medium text-slate-700 text-sm">Âge</span>
                        <input type="number" 
                        id="age"
                        placeholder="25"
                        className="block border-slate-300 focus:border-sky-500 focus:invalid:border-pink-500 disabled:border-slate-200 invalid:border-pink-500 bg-white disabled:bg-slate-50 shadow-sm disabled:shadow-none mt-1 px-3 py-2 border rounded-md focus:ring-1 focus:ring-sky-500 focus:invalid:ring-pink-500 w-full md:max-w-[70px] text-sm disabled:text-slate-500 invalid:text-pink-600 placeholder-slate-400 focus:outline-none"
                        min="0"
                        onChange= {(e) => onChange(id, "age", parseInt(e.target.value))} 
                        />
                </label>
            </div>
          
            <div className="relative md:flex flex-col justify-end items-center hidden">
                <Button className="block bg-gray-100 shadow-[0_2px_3px_-2px_#000] mb-1 ml-5 p-0 rounded w-auto h-auto text-sm group" onClick={() => remove(id)}>
                    <RiDeleteBin6Line className="group-hover:text-white w-4 h-4 text-red-600 self-center" />
                </Button>
            </div>
            <div className="relative md:flex flex-col justify-end items-center hidden">
                <span className="top-0 left-0 absolute text-orange-900 text-xs italic">Organisateur</span>
                <div className="bottom-[-5px] left-1 absolute">
                    <Checkbox  
                    defaultChecked={isOrganizer}
                    onChange={() => changeOrganizer(id)} 
                    ref={checkboxRef}
                    ripple={true}
                    color="teal"
                 
                    className="bg-gray-100 shadow-[0_2px_3px_-2px_#000] rounded w-6 h-6"
                    />
                </div>
             </div>

            <div className="flex justify-between items-center md:hidden mx-auto w-full max-w-[204px]">
                <div className="relative flex flex-col justify-end items-center md:hidden">
                    <Button className="block bg-gray-100 shadow-[0_2px_3px_-2px_#000] p-0 rounded w-auto h-auto text-sm group" onClick={() => remove(id)}>
                        <RiDeleteBin6Line className="group-hover:text-white w-4 h-4 text-red-600 self-center" />
                    </Button>
                </div>
                <div className="flex justify-end items-center">
                <span className="text-orange-900 text-xs italic">J&#39;organise</span>
                <Checkbox  
                defaultChecked={isOrganizer}
                onChange={() => changeOrganizer(id)} 
                ref={checkboxRef}
                ripple={true}
                color="teal"
                className="bg-gray-100 shadow-[0_2px_3px_-2px_#000] rounded w-6 h-6"
                />
                </div>
            </div>
    </div>
    )
}
