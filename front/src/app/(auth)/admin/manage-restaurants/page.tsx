import { Metadata } from "next";
import { RestaurantsPage } from "@taotask/modules/backoffice/react/pages/restaurants/RestaurantsPage";

export const metadata: Metadata = {
  title: "Gestion des restaurants",
  description: "Gestion des restaurants",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ManageRestaurant() {
  return (
    <>
      <RestaurantsPage />
    </>
  );
}
