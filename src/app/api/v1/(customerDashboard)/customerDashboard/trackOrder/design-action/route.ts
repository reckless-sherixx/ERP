import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DesignStatus } from "@prisma/client";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const submission = await prisma.designSubmission.findFirst({
            where: {
                orderId: orderId,
                isApprovedByAdmin: true, // Only fetch admin-approved submissions
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                Order: true,
                Assignee: true,
            },
        });

        if (!submission) {
            return NextResponse.json({ error: "No approved submission found" }, { status: 404 });
        }

        return NextResponse.json(submission);
    } catch (error) {
        console.error("Error fetching submission:", error);
        return NextResponse.json(
            { error: "Failed to fetch submission" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { submissionId, action } = body;

        const submission = await prisma.designSubmission.findUnique({
            where: { id: submissionId },
            include: {
                Order: true,
                Assignee: true,
            },
        });

        if (!submission?.orderId) {
            return NextResponse.json(
                { error: "Invalid submission data" },
                { status: 400 }
            );
        }

        // Find current active assignee
        const activeAssignee = await prisma.assignee.findFirst({
            where: {
                orderId: submission.orderId,
                status: {
                    in: [DesignStatus.PENDING, DesignStatus.APPROVED]
                }
            }
        });

        if (!activeAssignee) {
            return NextResponse.json(
                { error: "No active assignee found" },
                { status: 400 }
            );
        }

        const updatedSubmission = await prisma.$transaction(async (tx) => {
            if (action === 'revision') {
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
                    where: { id: submission.orderId! },
                    data: {
                        status: "IN_PRODUCTION",
                    },
                });

                // Update assignee status
                await tx.assignee.updateMany({
                    where: { 
                        orderId: submission.orderId!,
                        status: {
                            in: [DesignStatus.PENDING, DesignStatus.APPROVED]
                        }
                    },
                    data: {
                        status: DesignStatus.REVISION,
                    },
                });

                return submission;
            } else if (action === 'approve') {
                await tx.designSubmission.update({
                    where: { id: submissionId },
                    data: {
                        isApprovedByCustomer: true,
                    },
                });

                await tx.order.update({
                    where: { id: submission.orderId!},
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

                return submission;
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