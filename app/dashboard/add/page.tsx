import { Suspense } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AddDashboardPage from "./AddDashboardPage";

export default function Page() {
  return (
    <DashboardLayout>
      <Suspense fallback="Chargement...">
        <AddDashboardPage />
      </Suspense>
    </DashboardLayout>
  );
}
