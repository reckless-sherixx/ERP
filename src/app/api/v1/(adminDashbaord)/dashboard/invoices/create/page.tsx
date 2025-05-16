import { CreateInvoice } from "@/components/adminDashboardComponents/CreateInvoice";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import { canCreateInvoice } from "@/app/utils/dashboardAccess";

export default async function InvoiceCreationRoute() {
    const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }

    // Check if user has permission to create invoices
    if (!canCreateInvoice(session.user.role)) {
        redirect("/api/v1/dashboard");
    }

    const data = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            name: true,
            email: true,
            address: true,
        },
    });

    if (!data) {
        redirect("/api/v1/dashboard");
    }

    return (
        <CreateInvoice
            name={data.name ?? ""}
            address={data.address ?? ""}
            email={data.email ?? ""}
        />
    );
}