import { useState, useRef } from 'react';
import { RestaurantForm } from '@taotask/modules/backoffice/core/form/restaurant.form';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { useAppDispatch } from '@taotask/modules/store/store';
import { registerRestaurant } from '@taotask/modules/backoffice/core/useCase/register-restaurant.usecase';

export const useRestaurantForm = () => {
    const restaurantForm = useRef(new RestaurantForm());
    const dispatch = useAppDispatch();
    
    const [form, setForm] = useState<BackofficeDomainModel.RestaurantForm>(
        restaurantForm.current.getInitialState()
    );
    
    const [errors, setErrors] = useState<{
        name?: string;
        type?: string;
        stars?: string;
    }>({});
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    function updateField<T extends keyof BackofficeDomainModel.RestaurantForm>(
        field: T, 
        value: BackofficeDomainModel.RestaurantForm[T]
    ) {
        const newState = restaurantForm.current.updateField(form, field, value);
        setForm(newState);
        
        validateField(field, value as any);
    }

    function validateField(field: keyof BackofficeDomainModel.RestaurantForm, value: any) {
        let error: string | null = null;
        
        if (field === 'name') {
            error = restaurantForm.current.validateName(value);
        } else if (field === 'type') {
            error = restaurantForm.current.validateType(value);
        } else if (field === 'stars') {
            error = restaurantForm.current.validateStars(value);
        }
        
        setErrors(prev => ({
            ...prev,
            [field]: error || undefined
        }));
    }

    function resetForm() {
        const newState = restaurantForm.current.reset(form);
        setForm(newState);
        setErrors({});
        setSubmitResult(null);
    }

    async function handleSubmit() {
        if (!restaurantForm.current.isSubmitable(form)) {
            setSubmitResult({
                type: 'error',
                message: 'Veuillez corriger les erreurs avant de soumettre.'
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const dto = restaurantForm.current.toDTO(form);
            const result = await dispatch(registerRestaurant(dto));  
            
            setSubmitResult({
                type: 'success',
                message: `Restaurant "${dto.name}" créé avec succès !`
            });
        
            setTimeout(() => resetForm(), 2000);
        } catch (error: any) {
            setSubmitResult({
                type: 'error',
                message: error.message || 'Erreur lors de la création du restaurant.'
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    function isSubmitable() {
        return restaurantForm.current.isSubmitable(form);
    }

    return {
        form,           
        errors,         
        updateField,
        resetForm,
        handleSubmit,
        isSubmitting,
        submitResult,
        isSubmitable: isSubmitable()
    };
};