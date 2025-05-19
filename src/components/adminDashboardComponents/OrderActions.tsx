import { deleteOrder } from "@/actions";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { Badge } from "../ui/badge";

interface OrderActionsProps {
    id: string;
    status: OrderStatus;
}

function getStatusColor(status: OrderStatus) {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800";
        case "IN_PRODUCTION":
            return "bg-blue-100 text-blue-800";
        case "COMPLETED":
            return "bg-green-100 text-green-800";
        case "CANCELED":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

export function OrderActions({ id, status }: OrderActionsProps) {
    return (
        <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)}>
                {status.replace("_", " ")}
            </Badge>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/api/v1/dashboard/orders/${id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteOrder(id)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}