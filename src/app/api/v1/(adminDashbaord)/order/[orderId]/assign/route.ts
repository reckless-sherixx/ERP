import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = Promise<{ orderId: string }>;
export async function POST(
    request: Request,
    { params }: { params: Params }
) {
    try {
        const { userId } = await request.json();
        const { orderId } = await params;

        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Check if order is already assigned
        const existingAssignment = await prisma.assignee.findFirst({
            where: { orderId }
        });

        if (existingAssignment) {
            return NextResponse.json(
                { error: "Order is already assigned" },
                { status: 400 }
            );
        }

        await prisma.$transaction([
            prisma.assignee.create({
                data: {
                    orderId,
                    userId,
                }
            }),
            prisma.order.update({
                where: { id: orderId },
                data: {
                    isAssigned: true,
                    status: "IN_PRODUCTION"
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