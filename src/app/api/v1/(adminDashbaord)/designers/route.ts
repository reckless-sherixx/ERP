import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const designers = await prisma.user.findMany({
            where: {
                role: Role.DESIGN
            },
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: {
                        Assignee: {
                            where: {
                                order: {
                                    status: {
                                        not: "COMPLETED"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const formattedDesigners = designers.map(designer => ({
            id: designer.id,
            name: designer.name,
            email: designer.email,
            activeOrders: designer._count.Assignee
        }));

        return NextResponse.json(formattedDesigners);
    } catch (error) {
        console.error('Error fetching designers:', error);
        return NextResponse.json(
            { error: "Failed to fetch designers" },
            { status: 500 }
        );
    }
}