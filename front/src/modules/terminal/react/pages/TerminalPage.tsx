'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useAppDispatch, AppState } from '@taotask/modules/store/store';
import { TerminalDomainModel } from '../../core/model/terminal.domain-model';
import { terminalActions } from '../../core/store/terminal.slice';
import { WelcomeSection } from '../sections/welcome/WelcomeSection';
import { IdentifySection } from '../sections/identify/IdentifySection';
import { ConfirmationSection } from '../sections/confirmation/ConfirmationSection';
import { TerminalMenuBrowseSection } from '../sections/menu-browse/TerminalMenuBrowseSection';
import { TerminalPreOrderSection } from '../sections/pre-order/TerminalPreOrderSection';

export const TerminalPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');

    const step = useSelector((state: AppState) => state.terminal.step);

    useEffect(() => {
        if (restaurantId) {
            dispatch(terminalActions.setRestaurantId(restaurantId));
        }
    }, [restaurantId, dispatch]);

    const renderStep = () => {
        switch (step) {
            case TerminalDomainModel.TerminalStep.WELCOME:
                return <WelcomeSection />;
            case TerminalDomainModel.TerminalStep.IDENTIFY:
                return <IdentifySection />;
            case TerminalDomainModel.TerminalStep.MENU_BROWSE:
                return <TerminalMenuBrowseSection />;
            case TerminalDomainModel.TerminalStep.PRE_ORDER:
                return <TerminalPreOrderSection />;
            case TerminalDomainModel.TerminalStep.CONFIRMATION:
                return <ConfirmationSection />;
            default:
                return <WelcomeSection />;
        }
    };

    return (
        <main className="min-h-screen bg-luminous-bg-primary">
            {renderStep()}
        </main>
    );
};
