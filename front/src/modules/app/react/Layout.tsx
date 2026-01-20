"use client";
import React from "react";
import { Header } from "@taotask/modules/app/react/Header";
import { Footer } from "@taotask/modules/app/react/Footer";
export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {


  return (
    <>
      {/* Header temporairement caché jusqu'à création des pages */}
      <div className="hidden">
        <Header />
      </div>
      <section className="w-full">
        {children}
      </section>
      <Footer />
    </>
  );
};
