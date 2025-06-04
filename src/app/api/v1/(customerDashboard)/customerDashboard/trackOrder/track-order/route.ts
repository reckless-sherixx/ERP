import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderNumber = searchParams.get("orderNumber");
        const email = searchParams.get("email");

        if (!orderNumber || !email) {
            return NextResponse.json(
                { error: "Order number and email are required" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findFirst({
            where: {
                orderNumber: orderNumber,
                customerEmail: email,
            },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                customerName: true,
                customerEmail: true,
                itemDescription: true,
                totalPrice: true,
                createdAt: true,
                DesignSubmission: {
                    select: {
                        id: true,
                        fileUrl: true,
                        comment: true,
                        isApprovedByAdmin: true,
                        isApprovedByCustomer: true, 
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    where: {
                        isApprovedByAdmin: true // Only fetch admin-approved submissions
                    }
                },
                Assignee: {
                    select: {
                        status: true
                    }
                }
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "Failed to fetch order details" },
            { status: 500 }
        );
    }
}