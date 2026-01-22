'use client';
import React, { useState, useCallback } from 'react';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';

interface TerminalSectionProps {
    restaurantId: number;
}

const KIOSK_COMMANDS = [
    {
        os: 'Windows',
        command: (url: string) => `chrome.exe --kiosk --noerrdialogs "${url}"`,
    },
    {
        os: 'Linux',
        command: (url: string) => `google-chrome --kiosk --noerrdialogs --disable-translate --no-first-run "${url}"`,
    },
    {
        os: 'macOS',
        command: (url: string) => `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --kiosk "${url}"`,
    },
];

export const TerminalSection: React.FC<TerminalSectionProps> = ({ restaurantId }) => {
    const [copied, setCopied] = useState(false);

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const terminalUrl = `${baseUrl}/order/${restaurantId}`;

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(terminalUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [terminalUrl]);

    const handleTestTerminal = useCallback(() => {
        window.open(terminalUrl, '_blank');
    }, [terminalUrl]);

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h2 className="text-2xl font-serif text-luxury-text-primary mb-2">
                    Configuration du Terminal
                </h2>
                <p className="text-luxury-gold-muted">
                    Configurez une borne de commande en libre-service pour votre restaurant.
                </p>
            </div>

            <LuxuryCard>
                <div className="space-y-4">
                    <div>
                        <span className="text-sm text-luxury-gold-muted uppercase tracking-wider">
                            URL du Terminal
                        </span>
                        <div className="mt-2 flex items-center gap-4">
                            <code className="flex-1 bg-luxury-bg-primary px-4 py-3 rounded-lg text-luxury-text-primary border border-luxury-gold-border font-mono text-sm break-all">
                                {terminalUrl}
                            </code>
                            <LuxuryButton variant="secondary" onClick={handleCopy}>
                                {copied ? 'Copié !' : 'Copier'}
                            </LuxuryButton>
                        </div>
                    </div>
                    <div className="pt-4">
                        <LuxuryButton onClick={handleTestTerminal}>
                            Tester le terminal
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryCard>

            <LuxuryCard>
                <div className="space-y-6">
                    <h3 className="text-xl font-serif text-luxury-text-primary">
                        Instructions de configuration
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-luxury-gold font-medium mb-2">
                                1. Matériel requis
                            </h4>
                            <p className="text-luxury-text-secondary">
                                Une tablette tactile ou un écran tactile avec un navigateur web moderne
                                (Chrome, Firefox, Edge).
                            </p>
                        </div>

                        <div>
                            <h4 className="text-luxury-gold font-medium mb-2">
                                2. Configuration du mode kiosque (Chrome)
                            </h4>
                            <p className="text-luxury-text-secondary mb-3">
                                Lancez Chrome en mode kiosque pour un affichage plein écran sans barre de navigation :
                            </p>
                            <div className="space-y-3">
                                {KIOSK_COMMANDS.map(({ os, command }) => (
                                    <div key={os}>
                                        <span className="text-sm text-luxury-gold-muted">{os} :</span>
                                        <code className="block mt-1 bg-luxury-bg-primary px-4 py-2 rounded text-luxury-text-primary border border-luxury-gold-border font-mono text-xs break-all">
                                            {command(terminalUrl)}
                                        </code>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-luxury-gold font-medium mb-2">
                                3. Démarrage automatique
                            </h4>
                            <p className="text-luxury-text-secondary">
                                Ajoutez la commande ci-dessus au démarrage automatique de votre système
                                pour que le terminal se lance automatiquement à l'allumage de l'appareil.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-luxury-gold font-medium mb-2">
                                4. Quitter le mode kiosque
                            </h4>
                            <p className="text-luxury-text-secondary">
                                Utilisez <kbd className="px-2 py-1 bg-luxury-bg-primary border border-luxury-gold-border rounded text-sm">Alt + F4</kbd> (Windows/Linux)
                                ou <kbd className="px-2 py-1 bg-luxury-bg-primary border border-luxury-gold-border rounded text-sm">Cmd + Q</kbd> (macOS)
                                pour fermer le navigateur en mode kiosque.
                            </p>
                        </div>
                    </div>
                </div>
            </LuxuryCard>
        </div>
    );
};
