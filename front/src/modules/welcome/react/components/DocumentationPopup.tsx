"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const DocumentationPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem("hasSeenDocPopup");
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        sessionStorage.setItem("hasSeenDocPopup", "true");
        setIsOpen(false);
    };

    const handleGoToDoc = () => {
        sessionStorage.setItem("hasSeenDocPopup", "true");
        router.push("/docs");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative mx-4 max-w-lg w-full bg-luxury-bg-secondary border-2 border-luxury-gold rounded-xl p-8 shadow-2xl">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-luxury-text-secondary hover:text-luxury-text-primary transition-colors"
                    aria-label="Fermer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="text-center">
                    <div className="mb-4 text-luxury-gold">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-luxury-text-primary mb-4">
                        Bienvenue sur Taste Federation !
                    </h2>

                    <p className="text-luxury-text-secondary mb-6 leading-relaxed">
                        <strong className="text-luxury-gold">Avant de commencer</strong>, nous vous recommandons
                        <strong className="text-luxury-gold"> fortement</strong> de consulter notre documentation.
                        Elle vous guidera à travers toutes les fonctionnalités de l&apos;application et vous permettra
                        de profiter pleinement de votre expérience.
                    </p>

                    <button
                        onClick={handleGoToDoc}
                        className="w-full font-mono rounded border-2 border-luxury-gold bg-luxury-gold px-8 py-4
                            text-base font-bold uppercase tracking-wider text-luxury-bg-primary transition duration-150 ease-in-out
                            hover:bg-luxury-gold/90 hover:shadow-lg hover:shadow-luxury-gold/20
                            focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:ring-offset-2 focus:ring-offset-luxury-bg-secondary
                            active:bg-luxury-gold/80 mb-4"
                    >
                        Lire la documentation
                    </button>

                    <button
                        onClick={handleClose}
                        className="text-sm text-luxury-text-secondary hover:text-luxury-text-primary underline underline-offset-4 transition-colors"
                    >
                        Passer pour l&apos;instant
                    </button>
                </div>
            </div>
        </div>
    );
};
