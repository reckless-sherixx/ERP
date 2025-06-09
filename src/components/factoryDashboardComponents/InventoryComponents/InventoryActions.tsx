"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EyeIcon, MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import { EditMaterialDialog } from "./EditMaterialDialog";
import { InventoryStockStatus } from "@prisma/client";

interface InventoryActionsProps {
    id: string;
    status: InventoryStockStatus;
    item: {
        materialName: string;
        currentStock: number;
        reorderPoint: number;
        unit: string;
        supplier: string;
        category: string;
    };
}

export function InventoryActions({ id, status, item }: InventoryActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pencil className="size-4 mr-2" /> Edit Material
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditMaterialDialog
                isOpen={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                materialId={id}
                initialData={item}
            />
        </>
    );
}