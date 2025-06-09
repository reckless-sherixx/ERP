import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderNumber = searchParams.get('orderNumber');
        const email = searchParams.get('email');

        if (!orderNumber || !email) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: {
                orderNumber: orderNumber,
                customerEmail: email
            },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                productionStatus: true,
                customerName: true,
                customerEmail: true,
                itemDescription: true,
                totalPrice: true,
                createdAt: true,
                DesignSubmission: {
                    where: {
                        isApprovedByAdmin: true
                    },
                    select: {
                        id: true,
                        fileUrl: true,
                        comment: true,
                        isApprovedByCustomer: true,
                        isApprovedByAdmin: true,
                        createdAt: true
                    }
                },
                TaskAssignment: {
                    select: {
                        OrderSubmission: {
                            select: {
                                id: true,
                                fileUrl: true,
                                createdAt: true
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error tracking order:', error);
        return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
    }
}