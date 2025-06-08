"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus } from "lucide-react";
import { FactoryAssignOrderDialog } from "./FactoryAssignOrderDialog";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { FactoryOrder } from "@/types/factoryOrder";

interface FactoryTaskAssignmentProps {
    initialData: FactoryOrder[];
}

export function FactoryTaskAssignment({ initialData }: FactoryTaskAssignmentProps) {
    const [selectedOrder, setSelectedOrder] = useState<{
        id: string;
        orderNumber: string;
    } | null>(null);

    const [viewingOrder, setViewingOrder] = useState<FactoryOrder | null>(null);
    return (
        <>
            <Card className="mb-6 border border-black/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Available Orders for Assignment
                    </CardTitle>
                    <CardDescription>
                        Orders that need to be assigned to team members ({initialData.length} orders)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* UnAssigned Orders */}
                    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialData.map((order) => (
                            <div key={order.id} className="border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="font-medium">{order.orderNumber}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-muted-foreground">
                                                    {order.status.toLowerCase()}
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
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setViewingOrder(order)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => setSelectedOrder({
                                                id: order.id,
                                                orderNumber: order.orderNumber
                                            })}
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Assign
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Assign order dialog box */}
            {selectedOrder && (
                <FactoryAssignOrderDialog
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    orderId={selectedOrder.id}
                    orderNumber={selectedOrder.orderNumber}
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