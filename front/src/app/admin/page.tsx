import { Metadata } from "next";
import { DashboardPage } from "@taotask/modules/backoffice/react/pages/dashboard/DashboardPage";


export const metadata: Metadata = {
  title: "Administration",
  description: "Administration du site",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Admin() {
  return (
    <>
    <DashboardPage />;

    </>);
}


