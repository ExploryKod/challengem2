"use client";
import React, { useState } from "react";
import { useHeader } from "@taotask/modules/app/react/use-header";

export const Header: React.FC = () => {
  const presenter = useHeader();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      // Attendre la fin de l'animation avant de cacher le menu
      setTimeout(() => {
        setIsMobileMenuOpen(false);
      }, 300);
    }
  };

  return (
    <nav className="relative flex flex-wrap justify-between items-center dark:bg-neutral-800 shadow-neutral-700/10 shadow-sm dark:shadow-black/30 py-2 w-full header-minh">
      <div className="flex flex-wrap justify-between items-center px-4 sm:px-6 w-full">
        {/* Logo et bouton hamburger */}
        <div className="flex items-center">
          <button
            className="lg:hidden block border-0 bg-transparent hover:shadow-none focus:shadow-none py-2 pr-2.5 focus:ring-0 text-neutral-500 dark:text-neutral-200 hover:no-underline focus:no-underline focus:outline-none"
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
          <a className="text-blue dark:text-blue-400" href="/">
            <span className="[&>svg]:ml-2 [&>svg]:mr-3 [&>svg]:h-6 [&>svg]:w-6 lg:[&>svg]:ml-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-hand-platter"
                aria-hidden="true"
              >
                <path d="M12 3V2"/>
                <path d="M5 10a7.1 7.1 0 0 1 14 0"/>
                <path d="M4 10h16"/>
                <path d="M2 14h12a2 2 0 1 1 0 4h-2"/>
                <path d="m15.4 17.4 3.2-2.8a2 2 0 0 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2L5 18"/>
                <path d="M5 14v7H2"/>
              </svg>
            </span>
          </a>
        </div>

        {/* Menu de navigation - Desktop */}
        <div className="hidden lg:flex flex-grow items-center basis-auto">
          <ul className="flex flex-row mr-auto">
            <li>
              <a
                className="block lg:px-2 py-2 pr-2 text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 focus:text-neutral-600 dark:focus:text-neutral-300 [&.active]:text-black/80 dark:[&.active]:text-white/80 disabled:text-black/30 dark:disabled:text-white/30 dark:text-neutral-200 transition duration-150 ease-in-out"
                href="/order"
              >
                Nos restaurants
              </a>
            </li>
            <li>
              <a
                className="block lg:px-2 py-2 pr-2 text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 focus:text-neutral-600 dark:focus:text-neutral-300 [&.active]:text-black/80 dark:[&.active]:text-white/80 disabled:text-black/30 dark:disabled:text-white/30 dark:text-neutral-200 transition duration-150 ease-in-out"
                href="/mentions-legales"
              >
                A propos
              </a>
            </li>
          </ul>
        </div>

        {/* Boutons actions - Desktop */}
        <div className="hidden lg:flex items-center my-0 ml-auto">
          <button
            type="button"
            className="inline-block hover:bg-neutral-500 dark:hover:bg-neutral-700 hover:bg-opacity-10 dark:hover:bg-opacity-60 mr-2 px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-primary text-xs hover:text-primary-600 dark:hover:text-primary-500 focus:text-primary-600 dark:focus:text-primary-500 active:text-primary-700 dark:active:text-primary-600 dark:text-primary-400 uppercase leading-normal transition duration-150 ease-in-out focus:outline-none"
          >
            Créer un compte
          </button>
          <button
            type="button"
            className="inline-block bg-[#584523] focus:bg-primary-600 active:bg-primary-700 hover:opacity-75 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs uppercase leading-normal transition duration-150 ease-in-out focus:outline-none"
          >
            Mon compte
          </button>
        </div>

        {/* Menu mobile avec transitions élégantes */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop/Overlay avec fade */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={toggleMobileMenu}
              style={{ 
                top: 'var(--header-height-mobile)',
                animation: isAnimating ? 'fadeIn 0.3s ease-out forwards' : 'fadeOut 0.3s ease-in forwards'
              }}
            />
            
            {/* Menu slide depuis la gauche */}
            <div
              className="lg:hidden fixed left-0 w-64 bg-white dark:bg-neutral-800 shadow-lg z-50 overflow-y-auto"
              style={{
                top: 'var(--header-height-mobile)',
                height: 'calc(100vh - var(--header-height-mobile))',
                animation: isAnimating ? 'slideInFromLeft 0.3s ease-out forwards' : 'slideOutToLeft 0.3s ease-in forwards'
              }}
            >
              <div className="pt-2 pb-4">
                <ul className="flex flex-col space-y-1">
                  <li>
                    <a
                      className="block py-3 px-4 text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 focus:text-neutral-600 dark:focus:text-neutral-300 dark:text-neutral-200 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      href="/order"
                      onClick={(e) => {
                        toggleMobileMenu();
                      }}
                    >
                      Nos restaurants
                    </a>
                  </li>
                  <li>
                    <a
                      className="block py-3 px-4 text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 focus:text-neutral-600 dark:focus:text-neutral-300 dark:text-neutral-200 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      href="/mentions-legales"
                      onClick={(e) => {
                        toggleMobileMenu();
                      }}
                    >
                      A propos
                    </a>
                  </li>
                </ul>
                <div className="flex flex-col space-y-2 mt-4 px-4">
                  <button
                    type="button"
                    className="w-full text-left py-3 px-4 rounded font-medium text-primary text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:bg-opacity-60 uppercase transition duration-150 ease-in-out"
                    onClick={toggleMobileMenu}
                  >
                    Créer un compte
                  </button>
                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded bg-[#584523] font-medium text-white text-xs uppercase transition duration-150 ease-in-out hover:opacity-75"
                    onClick={toggleMobileMenu}
                  >
                    Mon compte
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};




