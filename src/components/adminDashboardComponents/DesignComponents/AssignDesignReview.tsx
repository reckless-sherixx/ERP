'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesignStatus, OrderStatus } from "@prisma/client";
import { Check, X, RotateCcw, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface DesignSubmission {
    id: string;
    fileUrl: string;
    comment: string;
    isApprovedByAdmin: boolean;
    isApprovedByCustomer: boolean;
    createdAt: Date;
}

interface Assignee {
    id: string;
    status: DesignStatus;
    user: {
        name: string;
    };
}

interface Submission {
    id: string;
    orderNumber: string;
    itemDescription: string;
    status: OrderStatus;
    DesignSubmission: DesignSubmission[];
    Assignee: Assignee[];
}

interface AdminDesignReviewProps {
    submissions: Submission[];
}

export function AdminDesignReview({ submissions: initialSubmissions }: AdminDesignReviewProps) {
    const [actionInProgress, setActionInProgress] = useState<string | null>(null);

    const handleDesignAction = async (submissionId: string, action: DesignStatus) => {
        setActionInProgress(submissionId);
        try {
            const response = await fetch(`/api/v1/designers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId,
                    action,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to process action");
            }

            const data = await response.json();
            
            if (action === DesignStatus.REVISION) {
                toast.success("Revision requested successfully");
            } else if (action === DesignStatus.APPROVED) {
                toast.success("Design approved successfully");
            }

            window.location.reload();
        } catch (error) {
            console.error("Action error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to process your request");
        } finally {
            setActionInProgress(null);
        }
    };

    const getSubmissionStatus = (submission: Submission) => {
        const assigneeStatus = submission.Assignee[0]?.status;
        const isApprovedByAdmin = submission.DesignSubmission[0].isApprovedByAdmin;
        const isRevision = assigneeStatus === DesignStatus.REVISION;
        const isPending = assigneeStatus === DesignStatus.PENDING;
        
        // Don't show actions if admin has already approved
        const canShowActions = !isApprovedByAdmin;

        return {
            isApprovedByAdmin,
            isRevision,
            isPending,
            canShowActions,
            status: assigneeStatus
        };
    };

    return (
        <div className="space-y-6">
            {initialSubmissions.map((submission) => {
                const submissionId = submission.DesignSubmission[0].id;
                const isProcessing = actionInProgress === submissionId;
                const { isApprovedByAdmin, canShowActions, status } = getSubmissionStatus(submission);

                return (
                    <Card key={submission.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">
                                    Order #{submission.orderNumber}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {canShowActions ? (
                                        <>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleDesignAction(submissionId, DesignStatus.APPROVED)}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4 mr-2" />
                                                )}
                                                Approve
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-yellow-600 hover:bg-yellow-700"
                                                onClick={() => handleDesignAction(submissionId, DesignStatus.REVISION)}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <RotateCcw className="w-4 h-4 mr-2" />
                                                )}
                                                Request Revision
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDesignAction(submissionId, DesignStatus.PENDING)}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <X className="w-4 h-4 mr-2" />
                                                )}
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                                                Approved by Admin
                                            </span>
                                            <span className="text-sm font-medium px-3 py-1 rounded-full bg-muted">
                                                Pending Customer Review
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="aspect-video relative rounded-lg border overflow-hidden">
                                    {submission.DesignSubmission[0]?.fileUrl && (
                                        <Image
                                            src={submission.DesignSubmission[0].fileUrl}
                                            alt="Design Preview"
                                            fill
                                            className="object-contain"
                                        />
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium">Order Details</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {submission.itemDescription}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Designer</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {submission.Assignee[0]?.user.name}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Status</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {isApprovedByAdmin ? 'Approved by Admin' : status?.toLowerCase()}
                                        </p>
                                    </div>
                                    {submission.DesignSubmission[0]?.comment && (
                                        <div>
                                            <h3 className="font-medium">Designer Notes</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {submission.DesignSubmission[0].comment}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}