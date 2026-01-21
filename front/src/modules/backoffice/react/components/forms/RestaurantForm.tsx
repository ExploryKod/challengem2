"use client"
import React, { useId } from 'react';
import { Button } from "flowbite-react";
import { useRestaurantForm } from '@taotask/modules/backoffice/react/components/forms/use-restaurant-form';

export const RestaurantForm: React.FC = () => {
    const {
        form,
        errors,
        updateField,
        resetForm,
        handleSubmit,
        isSubmitting,
        submitResult,
        isSubmitable
    } = useRestaurantForm();

    const nameInputId = useId();
    const typeInputId = useId();
    const starsInputId = useId();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit();
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Créer un restaurant</h2>
            
            {submitResult && (
                <div className={`p-4 mb-4 rounded ${
                    submitResult.type === "error" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-green-100 text-green-700"
                }`}>
                    {submitResult.message}
                </div>
            )}
            
            {isSubmitting && (
                <div className="p-4 mb-4 bg-blue-100 text-blue-700 rounded">
                    Création en cours...
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label htmlFor={nameInputId} className="block text-sm font-medium mb-2">
                        Nom du restaurant *
                    </label>
                    <input
                        type="text"
                        name="name"
                        id={nameInputId}
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Le Gourmet"
                        disabled={isSubmitting}
                    />
                    {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor={typeInputId} className="block text-sm font-medium mb-2">
                        Type de cuisine *
                    </label>
                    <select
                        name="type"
                        id={typeInputId}
                        value={form.type}
                        onChange={(e) => updateField('type', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                            errors.type ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    >
                        <option value="">Sélectionner un type</option>
                        <option value="Française">Française</option>
                        <option value="Italienne">Italienne</option>
                        <option value="Asiatique">Asiatique</option>
                        <option value="Japonaise">Japonaise</option>
                        <option value="Mexicaine">Mexicaine</option>
                        <option value="Méditerranéenne">Méditerranéenne</option>
                        <option value="Fusion">Fusion</option>
                    </select>
                    {errors.type && (
                        <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                    )}
                </div>

                <div>
                    <label htmlFor={starsInputId} className="block text-sm font-medium mb-2">
                        Nombre d'étoiles * (1-5)
                    </label>
                    <input
                        type="number"
                        name="stars"
                        id={starsInputId}
                        min="1"
                        max="5"
                        value={form.stars}
                        onChange={(e) => updateField('stars', parseInt(e.target.value))}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                            errors.stars ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                    />
                    {errors.stars && (
                        <p className="text-red-600 text-sm mt-1">{errors.stars}</p>
                    )}
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={!isSubmitable || isSubmitting}
                        className="bg-teal-500 hover:bg-teal-600"
                    >
                        {isSubmitting ? "Création..." : "Créer le restaurant"}
                    </Button>
                    
                    <Button
                        type="button"
                        color="gray"
                        onClick={resetForm}
                        disabled={isSubmitting}
                    >
                        Réinitialiser
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RestaurantForm;