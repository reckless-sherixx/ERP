"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { downloadFile, getFileExtension } from "@/app/utils/downloadImage";


interface ProductionSubmissionDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    order: {
        orderNumber: string;
        customerName: string;
        customerEmail: string | null;
        createdAt: Date;
        itemDescription: string;
        totalPrice: number;
        status: string;
        shippingAddress?: string;
        attachment?: string;
        Assignee?: {
            status:string;
            user: {
                name: string | null;
            };
        }[];
        DesignSubmission: {
            id: string;
            fileUrl: string;
            comment: string;
            createdAt: Date;
        }[] | null;
    };
}

//View the details of design submission for an order
export function ProductionSubmissionDetails({
    isOpen,
    onClose,
    order,
}: ProductionSubmissionDetailsProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const latestSubmission = order.DesignSubmission?.[0];
     const assigneeStatus = order.Assignee?.[0]?.status;
    const formatDate = (date: string | Date) => {
        if (!date) return "Not submitted yet";
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    //download the design submission file
    const handleDownload = async () => {
        if (!latestSubmission?.fileUrl) return;

        setIsDownloading(true);
        try {
            const extension = getFileExtension(latestSubmission.fileUrl);
            const filename = `design-${order.orderNumber}-${new Date().getTime()}.${extension}`;
            await downloadFile(latestSubmission.fileUrl, filename);
            toast.success('File downloaded successfully');
        } catch (error) {
            toast.error("Failed to download file");
        } finally {
            setIsDownloading(false);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Design Submission Details</DialogTitle>
                    <DialogDescription>
                        Review submitted design work for order {order.orderNumber}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6">
                    {/* Preview Section */}
                    <div className="space-y-4">
                        <div className="aspect-video relative rounded-lg border overflow-hidden bg-muted">
                            {latestSubmission?.fileUrl ? (
                                <Image
                                    src={latestSubmission.fileUrl}
                                    alt="Design Preview"
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleDownload}
                            disabled={isDownloading || !latestSubmission?.fileUrl}
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Design File
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                                Submission Status
                            </h3>
                            <Badge variant={
                                assigneeStatus === "APPROVED" 
                                    ? "success"
                                    : assigneeStatus === "REVISION"
                                        ? "warning"
                                        : assigneeStatus === "PENDING"
                                            ? "default"
                                            : "secondary"
                            }>
                                {assigneeStatus?.toLowerCase() || "pending"}
                            </Badge>
                        </div>

                        {latestSubmission?.comment && (
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                                    Designer Notes
                                </h3>
                                <div className="bg-muted rounded-md p-3">
                                    <p className="text-sm">{latestSubmission.comment}</p>
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                                Submission Date
                            </h3>
                            <p className="text-sm">
                                {latestSubmission?.createdAt ?
                                    formatDate(latestSubmission.createdAt) :
                                    "Not submitted yet"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
