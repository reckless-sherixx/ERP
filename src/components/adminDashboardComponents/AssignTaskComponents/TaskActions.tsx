"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    CheckCircle,
    EyeIcon,
    MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { AssignOrderDialog } from "./AssignOrderDialog";

interface TaskActionsProps {
    id: string;
    order: {
        orderNumber: string;
        customerName: string;
        customerAddress: string;
        customerEmail: string;
        createdAt: Date;
        itemDescription: string;
        totalPrice: number;
        status: string;
        shippingAddress?: string;
        isAssigned: boolean;
        Assignee?: {
            user: {
                name: string | null;
                email: string | null;
            };
        }[];
    };
}

export function TaskActions({ id, order }: TaskActionsProps) {
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showAssignDialog, setShowAssignDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
                        <EyeIcon className="size-4 mr-2" /> View Order
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                        <CheckCircle className="size-4 mr-2" />
                        {order.isAssigned ? 'Re-Assign Order' : 'Assign Order'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <OrderDetailsDialog
                isOpen={showViewDialog}
                onClose={() => setShowViewDialog(false)}
                order={order}
            />

            <AssignOrderDialog
                isOpen={showAssignDialog}
                onClose={() => setShowAssignDialog(false)}
                orderId={id}
                orderNumber={order.orderNumber}
            />
        </>
    );
}