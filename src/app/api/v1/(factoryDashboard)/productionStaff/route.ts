import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const staff = await prisma.user.findMany({
            where: {
                role: "PRODUCTION_STAFF"
            },
            select: {
                id: true,
                name: true,
                email: true,
                TaskAssignment: {
                    where: {
                        status: {
                            not: "FINISHING"
                        }
                    }
                }
            }
        });

        const formattedStaff = staff.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            activeOrders: user.TaskAssignment.length
        }));

        return NextResponse.json(formattedStaff);
    } catch (error) {
        console.error('Error fetching production staff:', error);
        return NextResponse.json(
            { error: "Failed to fetch production staff" },
            { status: 500 }
        );
    }
}