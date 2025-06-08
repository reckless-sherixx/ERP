"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductionSubmissionDetails } from "./ProductionSubmissionDetails";
import { Submission } from "@/types/submission";

interface ProductionCardProps {
    submissions: Submission[];
}

export function ProductionCard({ submissions }: ProductionCardProps) {
    const [viewingOrder, setViewingOrder] = useState<Submission | null>(null);

    return (
        <>
            <Card className="border border-black/20 shadow-lg">
                <CardContent className="pt-6">
                    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {submissions.map((submission) => (
                            <div key={submission.id} className="border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium">{submission.orderNumber}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge>
                                                {submission.status.toLowerCase().replace('_', ' ')}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(submission.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium">{submission.customerName}</h4>
                                    <p className="text-sm text-muted-foreground">{submission.itemDescription}</p>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setViewingOrder(submission)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {viewingOrder && (
                <ProductionSubmissionDetails
                    isOpen={!!viewingOrder}
                    onClose={() => setViewingOrder(null)}
                    order={viewingOrder}
                />
            )}
        </>
    );
}