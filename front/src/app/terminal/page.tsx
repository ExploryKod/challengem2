import { Metadata } from "next";
import { Suspense } from "react";
import { TerminalPage } from "@taotask/modules/terminal/react/pages/TerminalPage";

export const metadata: Metadata = {
    title: "Terminal - Taste Federation",
    description: "Borne de commande",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Terminal() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <TerminalPage />
        </Suspense>
    );
}
