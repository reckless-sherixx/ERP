import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { canEditInAdminDashboard } from "@/app/utils/dashboardAccess";
import { auth } from "@/app/utils/auth";
import { updateRoleSchema } from "@/app/utils/zodSchemas";

export async function PATCH(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse and validate the request body
        const body = await request.json();
        const result = updateRoleSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid role provided" },
                { status: 400 }
            );
        }

        // Get the validated role
        const { role } = result.data;

        // Check if user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: params.userId }
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Additional permission checks
        if (!canEditInAdminDashboard(session.user.role)) {
            return NextResponse.json(
                { error: "Unauthorized to modify user roles" },
                { status: 403 }
            );
        }

        // Prevent SYSTEM_ADMIN modification by non-SYSTEM_ADMIN
        if (targetUser.role === Role.SYSTEM_ADMIN && session.user.role !== Role.SYSTEM_ADMIN) {
            return NextResponse.json(
                { error: "Cannot modify SYSTEM_ADMIN role" },
                { status: 403 }
            );
        }

        // Update the user role
        const updatedUser = await prisma.user.update({
            where: { id: params.userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true
            }
        });

        return NextResponse.json({
            message: "Role updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
            { error: "Failed to update user role" },
            { status: 500 }
        );
    }
}