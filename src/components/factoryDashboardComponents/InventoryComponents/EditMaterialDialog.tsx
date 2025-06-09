"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ItemCategory } from "@prisma/client";
import { useActionState } from "react";
import { editMaterial } from "@/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { inventorySchema } from "@/app/utils/zodSchemas";

interface EditMaterialDialogProps {
    isOpen: boolean;
    onClose: () => void;
    materialId: string;
    initialData: {
        materialName: string;
        currentStock: number;
        reorderPoint: number;
        unit: string;
        supplier: string;
        category: string;
    };
}

export function EditMaterialDialog({
    isOpen,
    onClose,
    materialId,
    initialData,
}: EditMaterialDialogProps) {
    const [lastResult, action] = useActionState(editMaterial, undefined);
    const [form, fields] = useForm({
        lastResult,
        defaultValue: initialData, 
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: inventorySchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Material</DialogTitle>
                </DialogHeader>

                <form id={form.id} action={action} onSubmit={form.onSubmit}>
                    <input type="hidden" name="id" value={materialId} />
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Material Name</Label>
                            <Input
                                name={fields.materialName.name}
                                defaultValue={initialData.materialName}
                            />
                            <p className="text-red-500 text-sm">{fields.materialName.errors}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select name={fields.category.name} defaultValue={initialData.category}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ItemCategory).map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-red-500 text-sm">{fields.category.errors}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Unit</Label>
                            <Select name={fields.unit.name} defaultValue={initialData.unit}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sq ft">sq ft</SelectItem>
                                    <SelectItem value="board ft">board ft</SelectItem>
                                    <SelectItem value="pairs">pairs</SelectItem>
                                    <SelectItem value="gal">gal</SelectItem>
                                    <SelectItem value="sq m">sq m</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-red-500 text-sm">{fields.unit.errors}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Current Stock</Label>
                            <Input
                                type="number"
                                name={fields.currentStock.name}
                                defaultValue={initialData.currentStock}
                            />
                            <p className="text-red-500 text-sm">{fields.currentStock.errors}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Reorder Point</Label>
                            <Input
                                type="number"
                                name={fields.reorderPoint.name}
                                defaultValue={initialData.reorderPoint}
                            />
                            <p className="text-red-500 text-sm">{fields.reorderPoint.errors}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Supplier</Label>
                            <Input
                                name={fields.supplier.name}
                                defaultValue={initialData.supplier}
                            />
                            <p className="text-red-500 text-sm">{fields.supplier.errors}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Update Material</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}