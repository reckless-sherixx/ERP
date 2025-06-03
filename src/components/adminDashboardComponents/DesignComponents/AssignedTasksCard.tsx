"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus } from "lucide-react";
import { OrderDetailsDialog } from "../AssignTaskComponents/OrderDetailsDialog";
import { OrderStatus } from "@prisma/client";
import { SubmitWorkDialog } from "./SubmitWorkDialog";

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    customerAddress: string;
    createdAt: Date;
    itemDescription: string;
    totalPrice: number;
    status: OrderStatus;
    productId: string | null;
}

interface AssignedTasksCardProps {
    initialData: Order[];
}

export function AssignedTasksCard({ initialData }: AssignedTasksCardProps) {
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [submittingOrder, setSubmittingOrder] = useState<Order | null>(null);
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
                    {/* Assigned Orders */}
                    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialData.map((order) => (
                            <div key={order.id} className="border border-black/20 shadow-md rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="font-medium">{order.orderNumber}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-muted-foreground">
                                                    Pending
                                                </span>
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
                                        <Button
                                            variant="default"
                                            onClick={() => setSubmittingOrder(order)}
                                        >
                                            Submit Work
                                        </Button>
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
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Submit Work Dialog */}
            {submittingOrder && (
                <SubmitWorkDialog
                    isOpen={!!submittingOrder}
                    onClose={() => setSubmittingOrder(null)}
                    orderNumber={submittingOrder.orderNumber}
                    orderId={submittingOrder.id}
                />
            )}

            {/* View order dialog box */}
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