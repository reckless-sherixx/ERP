import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { canEditInAdminDashboard } from "@/app/utils/dashboardAccess";

export async function PATCH(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await requireUser();
        const { role } = await request.json();

        // Check permissions
        if (!canEditInAdminDashboard(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
        const updatedUser = await prisma.user.update({
            where: { id: params.userId },
            data: { role },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user role:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}