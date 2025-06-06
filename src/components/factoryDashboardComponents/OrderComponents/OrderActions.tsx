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
} from "lucide-react";
import Link from "next/link";

interface OrderActionsProps {
    id: string;    
}
export function OrderActions({ id}: OrderActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/api/v1/order/${id}`} target="_blank">
                        <DownloadCloudIcon className="size-4 mr-2" /> View Order
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/api/v1/dashboard/invoices/${id}/assign`}>
                        <CheckCircle className="size-4 mr-2" /> Assign Order
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}