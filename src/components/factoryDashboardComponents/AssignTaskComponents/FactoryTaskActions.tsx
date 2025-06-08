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
import { FactoryAssignOrderDialog } from "./FactoryAssignOrderDialog";
import { FactoryOrder } from "@/types/factoryOrder";

interface FactoryTaskActionsProps {
    id: string;
    order: FactoryOrder;
}

export function FactoryTaskActions({ id, order }: FactoryTaskActionsProps) {
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

            <FactoryAssignOrderDialog
                isOpen={showAssignDialog}
                onClose={() => setShowAssignDialog(false)}
                orderId={id}
                orderNumber={order.orderNumber}
            />
        </>
    );
}