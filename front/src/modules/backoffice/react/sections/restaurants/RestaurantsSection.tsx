"use client"
import React from 'react';
import { RestaurantForm } from '@taotask/modules/backoffice/react/components/forms/RestaurantForm';
import { useRestaurants } from '@taotask/modules/backoffice/react/sections/restaurants/use-restaurants.hook';

export const RestaurantsSection: React.FC = () => {
    const { restaurants, isLoading, error, refetch } = useRestaurants();

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Gestion des Restaurants
                </h1>
                <p className="text-gray-600">
                    Créez et gérez vos restaurants depuis cette interface
                </p>
            </div>

            <div className="mb-12">
                <RestaurantForm />
            </div>

            <div className="border-t pt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Restaurants existants ({restaurants.length})
                    </h2>
                    <button
                        onClick={refetch}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Actualiser
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Chargement...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {!isLoading && !error && restaurants.length === 0 && (
                    <div className="text-center py-8 text-gray-500 italic">
                        Aucun restaurant créé pour le moment.
                    </div>
                )}

                {!isLoading && !error && restaurants.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.map((restaurant) => (
                            <div 
                                key={restaurant.id} 
                                className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {restaurant.name}
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Type :</span> {restaurant.type}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Étoiles :</span> {'⭐'.repeat(restaurant.stars)}
                                    </p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                        Modifier
                                    </button>
                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
