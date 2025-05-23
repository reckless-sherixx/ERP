import { redirect } from "next/navigation";
import { canCreateOrder } from "@/app/utils/dashboardAccess";
import { requireUser } from "@/app/utils/hooks";
import { AddMaterial } from "@/components/factoryDashboardComponents/InventoryComponents/AddMaterial";

export default async function AddingMaterialToInventoryRoute() {
    const session = await requireUser();

    // Check if user has permission to add materials to inventory
    if (!canCreateOrder(session.user.role)) {
        redirect("/api/v1/factory/dashboard");
    }

    return (
        <AddMaterial/>
    );
}