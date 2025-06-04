import { prisma } from "@/lib/prisma";
import { DesignStatus, Role } from "@prisma/client";
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

//admin design actions 
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { submissionId, action } = body;

        const submission = await prisma.designSubmission.findUnique({
            where: { id: submissionId },
            include: {
                Assignee: true,
            },
        });

        if (!submission?.assigneeId) {
            return NextResponse.json(
                { error: "No assignee found for this submission" },
                { status: 400 }
            );
        }

        const updatedSubmission = await prisma.$transaction(async (tx) => {
            // Update design submission
            const updatedSubmission = await tx.designSubmission.update({
                where: { id: submissionId },
                data: {
                    isApprovedByAdmin: action === DesignStatus.APPROVED,
                },
            });

            // Update assignee status
            await tx.assignee.update({
                where: { id: submission.assigneeId! },
                data: {
                    status: action,
                },
            });

            return updatedSubmission;
        });

        return NextResponse.json(updatedSubmission);
    } catch (error) {
        console.error("Error processing design action:", error);
        return NextResponse.json(
            { error: "Failed to process design action" },
            { status: 500 }
        );
    }
}