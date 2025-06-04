import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DesignStatus } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { submissionId, action } = body;

        if (!submissionId || !action) {
            return NextResponse.json(
                { error: "Submission ID and action are required" },
                { status: 400 }
            );
        }

        // First, get the design submission to find related order and assignee
        const submission = await prisma.designSubmission.findUnique({
            where: { id: submissionId },
            include: {
                Order: true,
                Assignee: true,
            },
        });

        if (!submission?.assigneeId) {
            return NextResponse.json(
                { error: "No assignee found for this submission" },
                { status: 400 }
            );
        }

        // Update both the design submission and assignee status
        const updatedSubmission = await prisma.$transaction(async (tx) => {
            // Update design submission
            const updatedSubmission = await tx.designSubmission.update({
                where: { id: submissionId },
                data: {
                    isApprovedByCustomer: action === 'approve',
                },
            });

            // Update assignee status using the DesignStatus enum
            await tx.assignee.update({
                where: { id: submission.assigneeId! },
                data: {
                    status: action === 'approve' ? DesignStatus.APPROVED : DesignStatus.REVISION,
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