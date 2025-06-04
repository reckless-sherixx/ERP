import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesignStatus } from "@prisma/client";
import { Check, X, RotateCcw } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface AdminDesignReviewProps {
    submissions: any[];
}

export function AdminDesignReview({ submissions }: AdminDesignReviewProps) {
    const handleDesignAction = async (submissionId: string, action: DesignStatus) => {
        try {
            const response = await fetch(`/api/v1/dashboard/design`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId,
                    action,
                }),
            });

            if (!response.ok) throw new Error("Failed to process action");
            toast.success(`Design ${action.toLowerCase()} successfully`);
        } catch (error) {
            toast.error("Failed to process your request");
        }
    };

    return (
        <div className="space-y-6">
            {submissions.map((submission) => (
                <Card key={submission.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                                Order #{submission.orderNumber}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleDesignAction(submission.DesignSubmission[0].id, DesignStatus.APPROVED)}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                    onClick={() => handleDesignAction(submission.DesignSubmission[0].id, DesignStatus.REVISION)}
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Request Revision
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDesignAction(submission.DesignSubmission[0].id, DesignStatus.PENDING)}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
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
            ))}
        </div>
    );
}   