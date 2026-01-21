"use client";
import React from "react";
import { useHomePage } from "@taotask/modules/welcome/react/pages/home/use-home-page";
import { HeroSection } from "@taotask/modules/welcome/react/sections/hero/HeroSection";
import { ParcoursSection } from "@taotask/modules/welcome/react/sections/parcours/ParcoursSection";
import { useSelector } from "react-redux";
import { AppState } from "@taotask/modules/store/store";

export const HomePage: React.FC = () => {
  const presenter = useHomePage();

  return <main className="flex flex-col" ref={presenter.animText}>
      {!presenter.isParcoursSectionVisible && <HeroSection showParcoursSection={presenter.showParcoursSection} />}
      {presenter.isParcoursSectionVisible && (
        <>
          <div className="pt-5 pb-2 px-4 sm:px-6 lg:px-8 w-full content-section-minh bg-gradient-to-r from-amber-200 to-yellow-500 flex flex-col gap-6 sm:gap-8 lg:gap-10">
            <ParcoursSection 
              parcoursList={presenter.parcoursList}
            />
          </div>
          <div ref={presenter.bottomRef}></div>
        </>
      )}
  </main>
};
