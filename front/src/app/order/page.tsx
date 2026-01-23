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

interface OrderProps {
  searchParams: Promise<{ table?: string; restaurant?: string }>;
}

export default async function Order({ searchParams }: OrderProps) {
  const params = await searchParams;

  return (
    <OrderPage
      tableId={params.table}
      qrRestaurantId={params.restaurant}
    />
  );
}


