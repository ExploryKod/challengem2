import { Metadata } from "next";
import { use } from "react";
import { OrderPage } from "@taotask/modules/order/react/pages/order/OrderPage";

export const metadata: Metadata = {
    title: "Réserver - Terminal",
    description: "Commander une table",
    robots: {
        index: false,
        follow: false,
    },
};

export default function TerminalOrder({ params }: { params: Promise<{ restaurantId: string }> }) {
    const { restaurantId } = use(params);
    return <OrderPage restaurantId={restaurantId} />;
}
