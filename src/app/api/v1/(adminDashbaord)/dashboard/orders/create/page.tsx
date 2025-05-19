import { prisma } from "@/lib/prisma";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import { canCreateOrder } from "@/app/utils/dashboardAccess";
import { CreateOrder } from "@/components/adminDashboardComponents/CreateOrder";

export default async function InvoiceCreationRoute() {
    const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }

    // Check if user has permission to create invoices
    if (!canCreateOrder(session.user.role)) {
        redirect("/api/v1/dashboard");
    }

    return (
        <CreateOrder/>
    );
}