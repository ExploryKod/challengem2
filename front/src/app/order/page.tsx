import Link from "next/link";
import { Metadata } from "next";
import { OrderPage } from "@taotask/modules/order/react/pages/order/OrderPage";

export const metadata: Metadata = {
  title: "Réserver",
  description: "Commander une table",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Order() {
  return (
    <>
    <OrderPage />

    </>);
}


