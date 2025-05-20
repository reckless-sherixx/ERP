import { canCreateOrder } from "@/app/utils/dashboardAccess";
import { requireUser } from "@/app/utils/hooks";
import { EditOrder } from "@/components/adminDashboardComponents/EditOrder";
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation";

async function getData(orderId: string, userId: string) {
    const data = await prisma.order.findUnique({
        where: {
            id: orderId,
            userId: userId,
        },
    });
    if (!data) {
        return notFound();
    }
    return data;
}
export default async function ({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const session = await requireUser();

    // Check if user has permission to edit orders
    if (!canCreateOrder(session.user.role)) {
        redirect("/api/v1/dashboard");
    }
    const data = await getData(orderId, session.user?.id as string)

    return  <EditOrder data={data} />

} 