import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";


export async function GET() {
    try {
        const session = await requireUser();

        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.user.id,
                status: "UNREAD"
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}