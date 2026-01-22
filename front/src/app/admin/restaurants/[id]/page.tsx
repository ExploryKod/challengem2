import { Metadata } from "next";
import { use } from "react";
import { RestaurantDetailPage } from "@taotask/modules/backoffice/react/pages/restaurant-detail/RestaurantDetailPage";

export const metadata: Metadata = {
    title: "Gestion du restaurant",
    description: "Gestion du restaurant",
    robots: {
        index: false,
        follow: false,
    },
};

export default function RestaurantDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <RestaurantDetailPage restaurantId={parseInt(id, 10)} />;
}
