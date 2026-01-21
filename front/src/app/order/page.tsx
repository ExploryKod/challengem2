import Link from "next/link";
import { Metadata } from "next";
import { OrderPage } from "@taotask/modules/order/react/pages/order/OrderPage";

export const metadata: Metadata = {
  title: "Mentions Légales - Papilles des Suds",
  description: "Mentions légales du site Papilles des Suds",
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


