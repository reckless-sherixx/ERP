"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { SubmitButton } from "../../general/SubmitButton";
import { addMaterial } from "../../../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { inventorySchema } from "@/app/utils/zodSchemas";


export function AddMaterial() {
    const [lastResult, action] = useActionState(addMaterial, undefined);
    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: inventorySchema,
            });
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
                    <div className="flex gap-1 w-fit mb-6">
                        <Badge variant="secondary">Add Material</Badge>
                    </div>
                    {/* Customer Information */}
                    <div className="flex pt-2">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label>Material Name</Label>
                                <Input
                                    name={fields.materialName.name}
                                    placeholder="Customer Name"
                                />
                                <p className="text-red-500 text-sm">{fields.materialName.errors}</p>

                                <Label>Category</Label>
                                <Select name={fields.category.name}>
                                    <SelectTrigger className="w-full">
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
                                <Label>Unit</Label>
                                <Select name={fields.unit.name}>
                                    <SelectTrigger className="w-full">
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
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">

                                <Label>Current Stock</Label>
                                <Input
                                    name={fields.currentStock.name}
                                    placeholder="Current Stock"
                                />
                                <p className="text-red-500 text-sm">{fields.currentStock.errors}</p>
                                <Label>Reorder Point</Label>
                                <Input
                                    name={fields.reorderPoint.name}
                                    placeholder="Reorder Point"
                                />
                                <p className="text-red-500 text-sm">{fields.reorderPoint.errors}</p>
                                <Label>Supplier</Label>
                                <Input
                                    name={fields.supplier.name}
                                    placeholder="Supplier"
                                />
                                <p className="text-red-500 text-sm">{fields.supplier.errors}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end mt-6">
                        <div>
                            <SubmitButton text="Add Item" />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}