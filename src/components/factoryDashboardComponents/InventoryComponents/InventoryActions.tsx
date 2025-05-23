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
    DownloadCloudIcon,
    MoreHorizontal,
    Pencil,
    Trash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface OrderActionsProps {
    id: string;
    status: string;
}
export function InventoryActions({ id, status }: OrderActionsProps) {
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
                    <Link href={`/api/v1/orders/${id}`} target="_blank">
                        <DownloadCloudIcon className="size-4 mr-2" /> View Order
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
                {status !== "COMPLETED" && (
                    <DropdownMenuItem asChild>
                        <Link href={`/api/v1/dashboard/invoices/${id}/completed`}>
                            <CheckCircle className="size-4 mr-2" /> Mark as Completed
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}