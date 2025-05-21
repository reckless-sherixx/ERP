"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface EditRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    currentRole: Role;
    currentUserRole: Role;
}

const ROLE_OPTIONS = {
    SYSTEM_ADMIN: "System Admin",
    ADMIN: "Admin",
    FACTORY_MANAGER: "Factory Manager",
    INVENTORY_MANAGER: "Inventory Manager",
    DESIGN: "Design Team",
    PRODUCTION_STAFF: "Production Staff",
    SALES: "Sales Team",
    ACCOUNTING: "Accounting",
    CUSTOMER: "Customer",
} as const;

export function EditRoleModal({
    isOpen,
    onClose,
    userId,
    currentRole,
    currentUserRole,
}: EditRoleModalProps) {
    const [role, setRole] = useState<Role>(currentRole);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleUpdateRole = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/v1/dashboard/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Handle unauthorized - redirect to login
                    window.location.href = '/login';
                    return;
                }
                throw new Error(data.error || "Failed to update role");
            }

            toast.success("Role updated successfully");
            onClose();
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update role");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter available roles based on current user's role
    const availableRoles = Object.entries(ROLE_OPTIONS).filter(([roleKey]) => {
        if (currentUserRole === Role.SYSTEM_ADMIN) return true;
        if (currentUserRole === Role.ADMIN) {
            return roleKey !== "SYSTEM_ADMIN";
        }
        return false;
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User Role</DialogTitle>
                    <DialogDescription>
                        Change the role of this user. This will affect their permissions in the system.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableRoles.map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateRole}
                        disabled={role === currentRole || isLoading}
                    >
                        Update Role
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}