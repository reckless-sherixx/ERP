"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { SubmitButton } from "../general/SubmitButton";
import { createOrder } from "../../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { orderSchema } from "@/app/utils/zodSchemas";
import { formatCurrency } from "@/app/utils/formatCurrency";

export function CreateOrder() {
    const [lastResult, action] = useActionState(createOrder, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: orderSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [items, setItems] = useState([{
        productId: '',
        quantity: 1,
        unitPrice: 0,
        description: ''
    }]);

    const addItem = () => {
        setItems([...items, {
            productId: '',
            quantity: 1,
            unitPrice: 0,
            description: ''
        }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);
    };


    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
                    <input
                        type="hidden"
                        name={fields.estimatedDelivery.name}
                        value={selectedDate.toISOString()}
                    />

                    <div className="flex flex-col gap-1 w-fit mb-6">
                        <Badge variant="outline">New Order</Badge>
                    </div>

                    {/* Customer Information */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <Label>Customer Name</Label>
                            <Input
                                name={fields.customerName.name}
                                placeholder="Customer Name"
                            />
                            <p className="text-red-500 text-sm">{fields.customerName.errors}</p>

                            <Label>Customer Email</Label>
                            <Input
                                name={fields.customerEmail.name}
                                type="email"
                                placeholder="customer@example.com"
                            />
                            <p className="text-red-500 text-sm">{fields.customerEmail.errors}</p>

                            <Label>Customer Phone</Label>
                            <Input
                                name={fields.customerPhone.name}
                                placeholder="Phone Number"
                            />
                            <p className="text-red-500 text-sm">{fields.customerPhone.errors}</p>
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-2">
                            <Label>Address Line 1</Label>
                            <Input
                                name={`${fields.address.name}.line1`}
                                placeholder="Street Address"
                            />
                            <p className="text-red-500 text-sm">{fields.address?.errors}</p>

                            <Label>Address Line 2</Label>
                            <Input
                                name={`${fields.address.name}.line2`}
                                placeholder="Apt, Suite, etc. (optional)"
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label>City</Label>
                                    <Input
                                        name={`${fields.address.name}.city`}
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <Label>State</Label>
                                    <Input
                                        name={`${fields.address.name}.state`}
                                        placeholder="State"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label>Postal Code</Label>
                                    <Input
                                        name={`${fields.address.name}.postalCode`}
                                        placeholder="Postal Code"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Date */}
                    <div className="mb-6">
                        <Label>Estimated Delivery Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-[280px] text-left justify-start"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? (
                                        new Intl.DateTimeFormat("en-US", {
                                            dateStyle: "long",
                                        }).format(selectedDate)
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => setSelectedDate(date || new Date())}
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                            <Label>Order Items</Label>
                            <Button type="button" onClick={addItem} variant="outline" size="sm">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-start">
                                <div className="col-span-3">
                                    <Label>Product ID</Label>
                                    <Input
                                        name={`items.${index}.productId`}
                                        value={item.productId}
                                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        name={`items.${index}.quantity`}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Unit Price</Label>
                                    <Input
                                        type="number"
                                        name={`items.${index}.unitPrice`}
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-4">
                                    <Label>Description</Label>
                                    <Input
                                        name={`items.${index}.description`}
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-1 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length === 1}
                                    >
                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <div className="w-1/3">
                            <div className="flex justify-between py-2">
                                <span>Subtotal</span>
                                <span>
                                    {formatCurrency({
                                        amount: calculateTotal(),
                                        currency: "INR",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-t">
                                <span>Total</span>
                                <span className="font-medium underline underline-offset-2">
                                    {formatCurrency({
                                        amount: calculateTotal(),
                                        currency: "INR",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                        <Label>Notes</Label>
                        <Textarea
                            name={fields.note.name}
                            placeholder="Additional notes or instructions..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <SubmitButton text="Create Order" />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}