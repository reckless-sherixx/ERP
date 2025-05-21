"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@prisma/client";
import {
    Mail,
    MoreHorizontal,
    Pencil,
    Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { EditRoleModal } from "./EditRole";

interface UsersActionsProps {
    id: string;
    role: Role;
    currentUserRole: Role;
}
export function UsersActions({ id, role, currentUserRole }: UsersActionsProps) {
     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const canModify = currentUserRole === Role.SYSTEM_ADMIN ||
        (currentUserRole === Role.ADMIN && role !== Role.SYSTEM_ADMIN);
    const handleSendReminder = () => {
        toast.promise(
            fetch(`/api/email/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            {
                loading: "Sending reminder email...",
                success: "Reminder email sent successfully",
                error: "Failed to send reminder email",
            }
        );
    };

    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                    {canModify && (
                        <>
                            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                <Pencil className="size-4 mr-2" /> Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="text-red-600">
                                <Link href={`/api/v1/dashboard/users/${id}/delete`}>
                                    <Trash className="size-4 mr-2" /> Delete User
                                </Link>
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuItem onClick={handleSendReminder}>
                        <Mail className="size-4 mr-2" /> Send Email
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditRoleModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userId={id}
                currentRole={role}
                currentUserRole={currentUserRole}
            />
        </>
    );
}