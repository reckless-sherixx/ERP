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
import { submitOrderWork } from "@/actions";
import { ProductionStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface SubmitProductionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  orderId: string;
  currentStage: ProductionStatus;
}

const isSubmissionComplete = (status: ProductionStatus) => {
    return status === "FINISHING";
};

export function SubmitProductionDialog({
  isOpen,
  onClose,
  orderNumber,
  orderId,
  currentStage,
}: SubmitProductionDialogProps) {
  const [attachment, setAttachment] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!attachment) {
        toast.error("Please upload your work");
        setIsSubmitting(false);
        return;
      }

      await submitOrderWork({
        orderId,
        fileUrl: attachment,
        comment: "",
      });

      toast.success("Work submitted successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit work"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const getSubmissionStage = (status: ProductionStatus) => {
    switch (status) {
        case "PENDING":
            return "First submission - Cutting stage";
        case "CUTTING":
            return "Second submission - Assembly stage";
        case "ASSEMBLY":
            return "Final submission - Finishing stage";
        case "FINISHING":
            return "All submissions completed";
        default:
            return "Upload your work";
    }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Submit Work for: {orderNumber}</DialogTitle>
                    <DialogDescription className="space-y-2">
                        <p>Current stage: {currentStage.toLowerCase()}</p>
                        <p>{getSubmissionStage(currentStage)}</p>
                        <div className="mt-2 space-y-1">
                            <div className="text-sm">Production Progress:</div>
                            <div className="flex gap-2">
                                <Badge variant={currentStage === "CUTTING" ? "default" : "outline"}>
                                    Cutting
                                </Badge>
                                <Badge variant={currentStage === "ASSEMBLY" ? "default" : "outline"}>
                                    Assembly
                                </Badge>
                                <Badge variant={currentStage === "FINISHING" ? "default" : "outline"}>
                                    Finishing
                                </Badge>
                            </div>
                        </div>
                        {isSubmissionComplete(currentStage) && (
                            <p className="text-sm text-yellow-600 font-medium mt-2">
                                ✓ All submissions completed for this task
                            </p>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <UploadButton
                            onChange={(url) => setAttachment(url)}
                            value={attachment}
                            disabled={isSubmissionComplete(currentStage)}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || isSubmissionComplete(currentStage)}
                        >
                            {isSubmissionComplete(currentStage) 
                                ? "Task Completed" 
                                : isSubmitting 
                                    ? "Submitting..." 
                                    : "Submit Work"
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
  );
}
