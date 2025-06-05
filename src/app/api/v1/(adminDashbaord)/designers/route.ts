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

        // First, fetch the submission with its related data
        const submission = await prisma.designSubmission.findUnique({
            where: { id: submissionId },
            include: {
                Order: true,
                Assignee: {
                    include: {
                        user: true
                    }
                },
            },
        });

        if (!submission?.orderId) {
            return NextResponse.json(
                { error: "Invalid submission data" },
                { status: 400 }
            );
        }

        // Find the current active assignee
        const activeAssignee = await prisma.assignee.findFirst({
            where: {
                orderId: submission.orderId,
                status: {
                    in: [DesignStatus.PENDING, DesignStatus.REVISION, DesignStatus.APPROVED]
                }
            },
        });

        if (!activeAssignee?.id) {
            return NextResponse.json(
                { error: "No active assignee found for this submission" },
                { status: 400 }
            );
        }

        const updatedSubmission = await prisma.$transaction(async (tx) => {
            if (action === DesignStatus.REVISION) {
                // Reset approvals
                const updatedDesign = await tx.designSubmission.update({
                    where: { id: submissionId },
                    data: {
                        isApprovedByAdmin: false,
                        isApprovedByCustomer: false,
                    },
                });

                // Update order status
                const updatedOrder = await tx.order.update({
                    where: { id: submission.orderId as any},
                    data: {
                        status: "IN_PRODUCTION",
                    },
                });

                // Update assignee status
                await tx.assignee.update({
                    where: { id: activeAssignee.id },
                    data: {
                        status: DesignStatus.REVISION,
                    },
                });

                return {
                    ...updatedDesign,
                    Order: updatedOrder,
                };
            } else if (action === DesignStatus.APPROVED) {
                // Update for admin approval
                const updatedDesign = await tx.designSubmission.update({
                    where: { id: submissionId },
                    data: {
                        isApprovedByAdmin: true,
                        isApprovedByCustomer: false,
                    },
                });

                // Update order status
                const updatedOrder = await tx.order.update({
                    where: { id: submission.orderId as any },
                    data: {
                        status: "IN_PRODUCTION",
                    },
                });

                // Update assignee status
                await tx.assignee.update({
                    where: { id: activeAssignee.id },
                    data: {
                        status: DesignStatus.APPROVED,
                    },
                });

                return {
                    ...updatedDesign,
                    Order: updatedOrder,
                };
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