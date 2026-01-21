import { useState, useRef, useEffect } from 'react';
import { useDependencies } from '@taotask/modules/app/react/DependenciesProvider';

// namespaces
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { GuestForm } from '@taotask/modules/order/core/form/guest.form';
import { AppState, useAppDispatch } from '@taotask/modules/store/store';
import { chooseGuests } from '@taotask/modules/order/core/useCase/choose-guest.usecase';
import { IIDProvider } from '@taotask/modules/core/id-provider';
import { useSelector } from 'react-redux';

export const useGuestSection = () => {

    function addGuest() {
        // On va présenter cette méthode issu de l'extérieur à React via une méthode de présentation du même nom
        const newState = guestForm.current.addGuest(form);
        setForm(newState);
    }

    function removeGuest(id:string) {
        const newState = guestForm.current.removeGuest(form, id);
        setForm(newState);
        // version avant d'avoir mis cette méthode en dehors de react:
        // setGuest(guests.filter(guest => guest.id !== id));
    }

    function updateGuest<T extends keyof OrderingDomainModel.Guest>
    (id:string, key: T, value: OrderingDomainModel.Guest[T]) {
        const newState = guestForm.current.updateGuest(form, id, key, value);
        setForm(newState);
    }
        
    function changeOrganizer(id:string) {
        const newState = guestForm.current.changeOrganizer(form, id);
        setForm(newState);
    }

    function onNext() {
        dispatch(chooseGuests(form));
    }

    function isSubmitable() {
        return guestForm.current.isSubmitable(form)
    }
    const initialState = useSelector((state: AppState) => state.ordering.form);
    const dispatch = useAppDispatch();
    const idProvider = useDependencies().idProvider;
    const guestForm = useRef(new GuestForm(idProvider as IIDProvider));
    const bottomGuestRef = useRef<HTMLDivElement>(null);
    const [form, setForm] = useState<OrderingDomainModel.Form>(initialState);
    const checkBoxOrganizer = useRef<HTMLInputElement>(null)

    // Cela ne permettais pas d'assurer la persistance de l'état précédent (si je clique sur précèdent, le guests se vide, remis à 0)
    // const [form, setForm] = useState<OrderingDomainModel.Form>({guests:[], organizerId: null});

    useEffect(() => {
        // 👇️ scroll to bottom every time a guest is added
        bottomGuestRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [form.guests.length]);

    return {
        addGuest,
        removeGuest,
        updateGuest,
        onNext,
        changeOrganizer,
        isSubmitable: isSubmitable(),
        form,
        bottomGuestRef,
        checkBoxOrganizer
    }
}