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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AssignOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    orderNumber: string;
}

interface Designer {
    id: string;
    name: string | null;
    email: string | null;
    activeOrders: number;
}

export function AssignOrderDialog({
    isOpen,
    onClose,
    orderId,
    orderNumber,
}: AssignOrderDialogProps) {
    const [selectedDesigner, setSelectedDesigner] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [designers, setDesigners] = useState<Designer[]>([]);
    const router = useRouter();

    // Fetch designers when dialog opens
    useEffect(() => {
        if (isOpen) {
            const fetchDesigners = async () => {
                try {
                    const response = await fetch('/api/v1/designers');
                    if (!response.ok) {
                        throw new Error('Failed to fetch designers');
                    }
                    const data = await response.json();
                    setDesigners(data);
                } catch (error) {
                    toast.error("Failed to load designers");
                    console.error(error);
                }
            };
            fetchDesigners();
        }
    }, [isOpen, orderId]);

    const handleAssign = async () => {
        if (!selectedDesigner) {
            toast.error("Please select a designer");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/v1/order/${orderId}/assign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: selectedDesigner
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to assign order");
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
                        Assign order {orderNumber} to a team member
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <RadioGroup
                        value={selectedDesigner}
                        onValueChange={setSelectedDesigner}
                        className="space-y-4"
                    >
                        {designers.map((designer) => (
                            <div
                                key={designer.id}
                                className="flex items-center space-x-4 rounded-lg border p-4"
                            >
                                <RadioGroupItem value={designer.id} id={designer.id} />
                                <Label
                                    htmlFor={designer.id}
                                    className="flex flex-1 items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>
                                                {designer.name?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                {designer.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {designer.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {designer.activeOrders} active orders
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