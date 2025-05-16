import { auth } from "@/app/utils/auth";
import { canCreateInvoice } from "@/app/utils/dashboardAccess";
import { EditInvoice } from "@/components/adminDashboardComponents/EditInvoice";
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation";

//only the user with access can edit the pdf
async function getData(invoiceId: string, userId: string) {
    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId: userId,
        },
    });
    if (!data) {
        return notFound();
    }
    return data;
}

export default async function ({ params }: { params: Promise<{ invoiceId: string }> }) {
    const { invoiceId } = await params;
    const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }

    // Check if user has permission to edit invoices
    if (!canCreateInvoice(session.user.role)) {
        redirect("/api/v1/dashboard");
    }
    const data = await getData(invoiceId, session.user?.id as string)

    return  <EditInvoice data={data} />

} 