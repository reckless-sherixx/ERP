import { requireUser } from "@/app/utils/hooks";
import { EditInvoice } from "@/components/adminDashboardComponents/EditInvoice";
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation";

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
}

export default async function ({ params }: { params: Promise<{ invoiceId: string }> }) {
    const { invoiceId } = await params;
    const session = await requireUser();
    const data = await getData(invoiceId, session.user?.id as string)

    return  <EditInvoice data={data!} />

} 