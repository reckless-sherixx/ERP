"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus } from "lucide-react";
import { OrderDetailsDialog } from "../AssignTaskComponents/OrderDetailsDialog";
import { Badge } from "@/components/ui/badge";
import { DesignStatus, OrderStatus } from "@prisma/client";
import { SubmitWorkDialog } from "./SubmitWorkDialog";
import { Order } from "@/types/order";

interface AssignedTasksCardProps {
    initialData: Order[];
}

export function AssignedTasksCard({ initialData }: AssignedTasksCardProps) {
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [submittingOrder, setSubmittingOrder] = useState<Order | null>(null);

    const getOrderStatus = (order: Order) => {
        const assigneeStatus = order.Assignee?.[0]?.status;
        const needsRevision = assigneeStatus === DesignStatus.REVISION;
        const isPending = assigneeStatus === DesignStatus.PENDING;
        const status = assigneeStatus || DesignStatus.PENDING;

        return {
            needsRevision,
            isPending,
            status,
            canSubmit: needsRevision || isPending
        };
    };

    return (
        <>
            <Card className="mb-6 border border-black/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Your Assigned Tasks
                    </CardTitle>
                    <CardDescription>
                        Tasks assigned to you that need to be completed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialData.map((order) => {
                            const { needsRevision, status, canSubmit } = getOrderStatus(order);

                            return (
                                <div key={order.id} className="border border-black/20 shadow-md rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="font-medium">{order.orderNumber}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant={needsRevision ? "destructive" : "secondary"}>
                                                        {status.toLowerCase()}
                                                    </Badge>
                                                    •
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium">{order.customerName}</h4>
                                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium mb-2">Items ({order.itemDescription ? 1 : 0})</h4>
                                        <p className="text-sm text-muted-foreground">{order.itemDescription}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="text-lg font-bold">
                                            ₹{order.totalPrice.toFixed(2)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {canSubmit && (
                                                <Button
                                                    variant={needsRevision ? "destructive" : "default"}
                                                    onClick={() => setSubmittingOrder(order)}
                                                >
                                                    {needsRevision ? 'Submit Revision' : 'Submit Work'}
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setViewingOrder(order)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {submittingOrder && (
                <SubmitWorkDialog
                    isOpen={!!submittingOrder}
                    onClose={() => setSubmittingOrder(null)}
                    orderNumber={submittingOrder.orderNumber}
                    orderId={submittingOrder.id}
                    isRevision={submittingOrder.Assignee?.[0]?.status === DesignStatus.REVISION}
                />
            )}

            {viewingOrder && (
                <OrderDetailsDialog
                    isOpen={!!viewingOrder}
                    onClose={() => setViewingOrder(null)}
                    order={viewingOrder}
                />
            )}
        </>
    );
}