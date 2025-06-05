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
                Order: true,
            },
        });

        if (!submission?.orderId || !submission?.assigneeId) {
            return NextResponse.json(
                { error: "Invalid submission data" },
                { status: 400 }
            );
        }

        const updatedSubmission = await prisma.$transaction(async (tx) => {
            if (action === DesignStatus.REVISION) {
                // Reset approvals
                await tx.designSubmission.update({
                    where: { id: submissionId },
                    data: {
                        isApprovedByAdmin: false,
                        isApprovedByCustomer: false,
                    },
                });

                // Update order status
                await tx.order.update({
                    where: { id: submission.orderId as any},
                    data: {
                        status: "IN_PRODUCTION",
                    },
                });

                // Re-assign to the designer by creating a new assignee record
                if (submission.Assignee?.userId) {
                    await tx.assignee.create({
                        data: {
                            orderId: submission.orderId as any,
                            userId: submission.Assignee.userId,
                            status: DesignStatus.REVISION,
                        },
                    });
                }

                // Update previous assignee status
                await tx.assignee.update({
                    where: { id: submission.assigneeId as any },
                    data: {
                        status: DesignStatus.REVISION,
                    },
                });
            } else {
                // For other actions (APPROVED, PENDING)
                await tx.designSubmission.update({
                    where: { id: submissionId },
                    data: {
                        isApprovedByAdmin: action === DesignStatus.APPROVED,
                    },
                });

                await tx.assignee.update({
                    where: { id: submission.assigneeId as any },
                    data: {
                        status: action,
                    },
                });
            }

            return submission;
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