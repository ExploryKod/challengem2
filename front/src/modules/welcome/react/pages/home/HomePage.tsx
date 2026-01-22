"use client";
import React from "react";
import { useHomePage } from "@taotask/modules/welcome/react/pages/home/use-home-page";
import { HeroSection } from "@taotask/modules/welcome/react/sections/hero/HeroSection";

export const HomePage: React.FC = () => {
  const presenter = useHomePage();

  return (
    <main className="flex flex-col" ref={presenter.animText}>
      <HeroSection />
    </main>
  );
};
