"use client";
import React from "react";
import { useHomePage } from "@taotask/modules/welcome/react/pages/home/use-home-page";
import { HeroSection } from "@taotask/modules/welcome/react/sections/hero/HeroSection";
import { useSelector } from "react-redux";
import { AppState } from "@taotask/modules/store/store";

export const HomePage: React.FC = () => {
  const presenter = useHomePage();

  return <main className="flex flex-col" ref={presenter.animText}>
      {!presenter.isGuestSectionVisible && <HeroSection showGuestSection={presenter.showGuestSection} />}

      {!presenter.isGuestSectionVisible ||
      (<>
       <div>
            <h1>Bienvenue sur Taste Fed</h1>
      </div>
      <div ref={presenter.bottomRef}></div>
      </>)}
  </main>
};
