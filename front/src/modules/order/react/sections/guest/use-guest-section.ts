import { useState, useRef, useEffect } from 'react';
import { useDependencies } from '@taotask/modules/app/react/DependenciesProvider';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { GuestForm } from '@taotask/modules/order/core/form/guest.form';
import { AppState, useAppDispatch } from '@taotask/modules/store/store';
import { chooseGuests } from '@taotask/modules/order/core/useCase/choose-guest.usecase';
import { IIDProvider } from '@taotask/modules/core/id-provider';
import { useSelector } from 'react-redux';

export const useGuestSection = () => {
    const selectedMenuId = useSelector((state: AppState) => state.ordering.selectedMenuId);

    function addGuest() {
        const newState = guestForm.current.addGuest(form, selectedMenuId);
        setForm(newState);
    }

    function removeGuest(id:string) {
        const newState = guestForm.current.removeGuest(form, id);
        setForm(newState);
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

    const tableCapacity = useSelector((state: AppState) => {
        const tableId = state.ordering.form.tableId;
        const table = state.ordering.availableTables.data?.find(t => t.id === tableId);
        return table?.capacity || 0;
    });

    useEffect(() => {
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
        checkBoxOrganizer,
        tableCapacity,
        isAddGuestDisabled: form.guests.length >= tableCapacity,
    }
}