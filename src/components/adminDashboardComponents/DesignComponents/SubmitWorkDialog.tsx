"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UploadButton } from "@/components/general/UploadButton";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitDesignWork } from "@/actions";

interface SubmitWorkDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orderNumber: string;
    orderId: string;
    isRevision: boolean;     
}

export function SubmitWorkDialog({ isOpen, onClose, orderNumber, orderId , isRevision }: SubmitWorkDialogProps) {
    const [attachment, setAttachment] = useState<string>();
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!attachment) {
            toast.error("Please upload your design work");
            setIsSubmitting(false);
            return;
        }

        try {
            await submitDesignWork({
                orderId,
                comment,
                fileUrl: attachment,
                isRevision,
            });

            toast.success("Work submitted successfully!");
            onClose();
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to submit work");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isRevision ? 'Submit Revision for:' : 'Submit Work for:'} {orderNumber}
                    </DialogTitle>
                    <DialogDescription>
                        {isRevision 
                            ? 'Upload your revised design work based on the feedback'
                            : 'Upload your completed design work for review'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label>Upload {isRevision ? 'Revised' : 'Design'} Work</Label>
                            <UploadButton
                                onChange={(url) => setAttachment(url)}
                                value={attachment}
                            />
                        </div>

                        <div>
                            <Label>
                                {isRevision ? 'Revision Notes' : 'Comments'}
                            </Label>
                            <Textarea
                                placeholder={
                                    isRevision 
                                        ? "Explain the changes made in this revision..."
                                        : "Add any comments about your submission..."
                                }
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            variant={isRevision ? "destructive" : "default"}
                        >
                            {isSubmitting 
                                ? "Submitting..." 
                                : isRevision 
                                    ? "Submit Revision" 
                                    : "Submit Work"
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}