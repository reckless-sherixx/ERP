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
import { Clock } from "lucide-react";

interface OrderDetailsDialogProps {
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
    };
}

export function OrderDetailsDialog({ isOpen, onClose, order }: OrderDetailsDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Complete information for order {order.orderNumber}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-muted-foreground">Customer</h3>
                            <p className="text-base font-medium">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerEmail ?? ""}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-semibold text-muted-foreground">Order Total</h3>
                            <p className="text-xl font-semibold">₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Items Ordered</h3>
                        <div className="bg-muted rounded-md p-3">
                            <div className="space-y-2">
                                {order.itemDescription.split(',').map((item, index) => (
                                    <p key={index} className="text-sm">{item.trim()}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {order.shippingAddress && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Shipping Address</h3>
                            <p className="text-sm">{order.shippingAddress}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Status</h3>
                            <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {order.status || 'pending'}
                            </Badge>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Assigned To</h3>
                            <p className="text-sm">Unassigned</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Order Date</h3>
                        <p className="text-sm">
                            {new Date(order.createdAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            })}
                        </p>
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