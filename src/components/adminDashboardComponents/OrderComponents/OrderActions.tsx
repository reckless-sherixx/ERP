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
    Pencil,
    Trash,
} from "lucide-react";
import Link from "next/link";

interface OrderActionsProps {
    id: string;
}
export function OrderActions({ id}: OrderActionsProps) {
    // const handleSendReminder = () => {
    //     toast.promise(
    //         fetch(`/api/email/${id}`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         }),
    //         {
    //             loading: "Sending reminder email...",
    //             success: "Reminder email sent successfully",
    //             error: "Failed to send reminder email",
    //         }
    //     );
    // };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/api/v1/dashboard/orders/${id}`}>
                        <Pencil className="size-4 mr-2" /> Edit Order
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/api/v1/order/${id}`} target="_blank">
                        <EyeIcon className="size-4 mr-2" /> View Order
                    </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={handleSendReminder}>
                    <Mail className="size-4 mr-2" /> Reminder Email
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                    <Link href={`/api/v1/dashboard/orders/${id}/delete`}>
                        <Trash className="size-4 mr-2" /> Delete Order
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/api/v1/dashboard/taskAssignment`}>
                        <CheckCircle className="size-4 mr-2" /> Assign Order
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}