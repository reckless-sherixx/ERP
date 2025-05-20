import { redirect } from "next/navigation";
import { canCreateOrder } from "@/app/utils/dashboardAccess";
import { CreateOrder } from "@/components/adminDashboardComponents/CreateOrder";
import { requireUser } from "@/app/utils/hooks";

export default async function OrderCreationRoute() {
    const session = await requireUser();

    // Check if user has permission to create orders
    if (!canCreateOrder(session.user.role)) {
        redirect("/api/v1/dashboard");
    }

    return (
        <CreateOrder/>
    );
}