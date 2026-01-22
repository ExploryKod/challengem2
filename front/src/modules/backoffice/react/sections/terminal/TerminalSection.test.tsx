import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TerminalSection } from './TerminalSection';

describe('TerminalSection', () => {
    const mockRestaurantId = 42;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the terminal URL with restaurant id', () => {
        render(<TerminalSection restaurantId={mockRestaurantId} />);

        // jsdom provides http://localhost as origin by default
        // The URL appears in the main display and in kiosk commands, so use getAllByText
        const urlElements = screen.getAllByText(/\/order\/42/);
        expect(urlElements.length).toBeGreaterThan(0);
        // The main URL display should be present
        expect(screen.getByText('http://localhost/order/42')).toBeInTheDocument();
    });

    it('should render the page title', () => {
        render(<TerminalSection restaurantId={mockRestaurantId} />);

        expect(screen.getByText('Configuration du Terminal')).toBeInTheDocument();
    });

    it('should render kiosk commands for all operating systems', () => {
        render(<TerminalSection restaurantId={mockRestaurantId} />);

        expect(screen.getByText('Windows :')).toBeInTheDocument();
        expect(screen.getByText('Linux :')).toBeInTheDocument();
        expect(screen.getByText('macOS :')).toBeInTheDocument();
    });

    it('should copy terminal URL to clipboard when copy button is clicked', async () => {
        render(<TerminalSection restaurantId={mockRestaurantId} />);

        const copyButton = screen.getByRole('button', { name: 'Copier' });
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            expect.stringContaining('/order/42')
        );
    });

    it('should show "Copié !" after copying', async () => {
        render(<TerminalSection restaurantId={mockRestaurantId} />);

        const copyButton = screen.getByRole('button', { name: 'Copier' });
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Copié !' })).toBeInTheDocument();
        });
    });

    it('should open terminal URL in new tab when test button is clicked', () => {
        const mockOpen = jest.fn();
        window.open = mockOpen;

        render(<TerminalSection restaurantId={mockRestaurantId} />);

        const testButton = screen.getByRole('button', { name: 'Tester le terminal' });
        fireEvent.click(testButton);

        expect(mockOpen).toHaveBeenCalledWith(
            expect.stringContaining('/order/42'),
            '_blank'
        );
    });

    it('should display setup instructions sections', () => {
        render(<TerminalSection restaurantId={mockRestaurantId} />);

        expect(screen.getByText('Instructions de configuration')).toBeInTheDocument();
        expect(screen.getByText('1. Matériel requis')).toBeInTheDocument();
        expect(screen.getByText('2. Configuration du mode kiosque (Chrome)')).toBeInTheDocument();
        expect(screen.getByText('3. Démarrage automatique')).toBeInTheDocument();
        expect(screen.getByText('4. Quitter le mode kiosque')).toBeInTheDocument();
    });

    it('should display keyboard shortcuts for exiting kiosk mode', () => {
        render(<TerminalSection restaurantId={mockRestaurantId} />);

        expect(screen.getByText('Alt + F4')).toBeInTheDocument();
        expect(screen.getByText('Cmd + Q')).toBeInTheDocument();
    });
});
