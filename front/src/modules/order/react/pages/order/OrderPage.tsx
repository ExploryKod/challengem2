"use client";
import React from "react";
import { GuestSection } from "@taotask/modules/order/react/sections/guest/GuestSection";
import { RestaurantSection } from "@taotask/modules/order/react/sections/restaurant/RestaurantSection";
import { HeroSection } from "@taotask/modules/order/react/sections/hero/HeroSection";
import { useOrderPage } from "@taotask/modules/order/react/pages/order/use-order-page";

export const OrderPage: React.FC = () => {
  const presenter = useOrderPage();

  return <main className="flex flex-col" ref={presenter.animText}>
      {!presenter.isGuestSectionVisible && <HeroSection showGuestSection={presenter.showGuestSection} />}

      {!presenter.isGuestSectionVisible ||
      (<>
      <div className="pt-5 pb-2 px-4 sm:px-6 lg:px-8 w-full content-section-minh bg-gradient-to-r from-amber-200 to-yellow-500 flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <RestaurantSection restaurantList={presenter.restaurantList} selectRestaurant={presenter.selectRestaurant}/>

        {!presenter.restaurantList.restaurantId
        || <GuestSection restaurantList={presenter.restaurantList} />}
        
      </div>
      <div ref={presenter.bottomRef}></div>
      </>)}
  </main>
};
