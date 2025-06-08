import { requireUser } from "@/app/utils/hooks";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const session = await requireUser();
        
        if (!session?.user || !["SYSTEM_ADMIN", "FACTORY_MANAGER"].includes(session.user.role)) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId } = await request.json();
        const { orderId } = params;

        const existingOrder = await prisma.order.findFirst({
            where: {
                id: orderId,
                DesignSubmission: {
                    some: {
                        isApprovedByAdmin: true,
                        isApprovedByCustomer: true
                    }
                },
                isAssigned:false
            }
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: "Order not found or not approved" },
                { status: 404 }
            );
        }

        await prisma.$transaction([
            prisma.taskAssignment.create({
                data: {
                    orderId,
                    userId,
                    status: "PENDING"
                }
            }),
            prisma.order.update({
                where: { id: orderId },
                data: {
                    isAssigned: true,
                    status: "IN_PRODUCTION",
                    productionStatus: "CUTTING"
                }
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Assignment error:', error);
        return NextResponse.json(
            { error: "Failed to assign order" },
            { status: 500 }
        );
    }
}