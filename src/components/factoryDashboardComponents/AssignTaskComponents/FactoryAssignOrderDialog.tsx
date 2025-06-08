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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FactoryAssignOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    orderNumber: string;
}

interface ProductionStaff {
    id: string;
    name: string | null;
    email: string | null;
    activeOrders: number;
}

export function FactoryAssignOrderDialog({
    isOpen,
    onClose,
    orderId,
    orderNumber,
}: FactoryAssignOrderDialogProps) {
    const [selectedStaff, setSelectedStaff] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [staff, setStaff] = useState<ProductionStaff[]>([]);
    const router = useRouter();

     // Fetch production staff when dialog opens
    useEffect(() => {
        if (isOpen) {
            const fetchStaff = async () => {
                try {
                    const response = await fetch('/api/v1/productionStaff');
                    if (!response.ok) {
                        throw new Error('Failed to fetch production staff');
                    }
                    const data = await response.json();
                    setStaff(data);
                } catch (error) {
                    toast.error("Failed to load production staff");
                    console.error(error);
                }
            };
            fetchStaff();
        }
    }, [isOpen]);

    const handleAssign = async () => {
    if (!selectedStaff) {
        toast.error("Please select a production staff member");
        return;
    }

    try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/factory/dashboard/orders/${orderId}/assignStaff`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: selectedStaff
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to assign order");
        }

        toast.success("Order assigned successfully");
        router.refresh(); 
        onClose();
    } catch (error) {
        toast.error("Failed to assign order");
        console.error(error);
    } finally {
        setIsLoading(false);
    }
};

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Assign Order</DialogTitle>
                    <DialogDescription>
                        Assign order {orderNumber} to a production team member
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <RadioGroup
                        value={selectedStaff} 
                        onValueChange={setSelectedStaff} 
                        className="space-y-4"
                    >
                        {staff.map((member) => ( 
                            <div
                                key={member.id}
                                className="flex items-center space-x-4 rounded-lg border p-4"
                            >
                                <RadioGroupItem value={member.id} id={member.id} />
                                <Label
                                    htmlFor={member.id}
                                    className="flex flex-1 items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>
                                                {member.name?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                {member.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {member.activeOrders} active orders
                                    </span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleAssign} disabled={isLoading}>
                        Assign Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}