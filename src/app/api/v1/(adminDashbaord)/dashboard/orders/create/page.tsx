import { CreateOrder } from "@/components/adminDashboardComponents/CreateOrder";
import { requireUser } from "@/app/utils/hooks";
import { redirect } from "next/navigation";
import { canCreateOrder } from "@/app/utils/dashboardAccess";

export default async function CreateOrderPage() {
    const session = await requireUser();

    if (!session?.user || !canCreateOrder(session.user.role)) {
        redirect("/api/v1/dashboard");
    }

    return <CreateOrder />;
}