import { Metadata } from "next";
import { ReservationPage } from "@taotask/modules/backoffice/react/pages/reservation/ReservationPage";


export const metadata: Metadata = {
  title: "Gestion des réservations",
  description: "Gestion des réservations",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ManageReservations() {
  return (
    <>
    <ReservationPage />

    </>);
}


