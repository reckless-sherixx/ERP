"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus, deleteOrder } from "@/actions";

interface OrderActionsProps {
    id: string;
    status: OrderStatus;
}

export function OrderActions({ id, status }: OrderActionsProps) {
    const router = useRouter();

    const handleStatusUpdate = async (newStatus: OrderStatus) => {
        try {
            await updateOrderStatus(id, newStatus);
            toast.success("Order status updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOrder(id);
            toast.success("Order deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete order");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/api/v1/dashboard/orders/${id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/api/v1/orders/${id}`}>Edit Order</Link>
                </DropdownMenuItem>
                {status !== "COMPLETED" && (
                    <DropdownMenuItem
                        onClick={() => handleStatusUpdate("COMPLETED")}
                    >
                        Mark as Completed
                    </DropdownMenuItem>
                )}
                {status === "PENDING" && (
                    <DropdownMenuItem
                        onClick={() => handleStatusUpdate("IN_PRODUCTION")}
                    >
                        Start Production
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                >
                    Delete Order
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}