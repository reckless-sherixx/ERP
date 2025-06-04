'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesignStatus } from "@prisma/client";
import { Check, X, RotateCcw, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface AdminDesignReviewProps {
    submissions: any[];
}

export function AdminDesignReview({ submissions: initialSubmissions }: AdminDesignReviewProps) {
    const [actionInProgress, setActionInProgress] = useState<string | null>(null);

    const handleDesignAction = async (submissionId: string, action: DesignStatus) => {
        setActionInProgress(submissionId);
        try {
            // Updated API endpoint path
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
                const error = await response.json();
                throw new Error(error.error || "Failed to process action");
            }

            toast.success(`Design ${action.toLowerCase()} successfully`);
            window.location.reload();
        } catch (error) {
            toast.error("Failed to process your request");
            setActionInProgress(null);
        }
    };

    return (
        <div className="space-y-6">
            {initialSubmissions.map((submission) => {
                const submissionId = submission.DesignSubmission[0].id;
                const isProcessing = actionInProgress === submissionId;
                const isApproved = submission.DesignSubmission[0].isApprovedByAdmin;
                const isRevision = submission.Assignee[0]?.status === DesignStatus.REVISION;
                const isPending = submission.Assignee[0]?.status === DesignStatus.PENDING;
                const isActioned = isApproved || isRevision || isPending;

                return (
                    <Card key={submission.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">
                                    Order #{submission.orderNumber}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {!isActioned ? (
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
                                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-muted">
                                            Status: {submission.Assignee[0]?.status.toLowerCase()}
                                        </span>
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
                                            {submission.Assignee[0]?.status}
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
                )
            })}
        </div>
    );
}   