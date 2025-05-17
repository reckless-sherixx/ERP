"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { SubmitButton } from "../general/SubmitButton";
import { createOrder } from "@/actions";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { format, addMonths } from "date-fns";
import { orderSchema } from "@/app/utils/zodSchemas";


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
    const [items, setItems] = useState([
        { productId: "", quantity: 1, unitPrice: 0, description: "" },
    ]);

    const addItem = () => {
        setItems([...items, { productId: "", quantity: 1, unitPrice: 0, description: "" }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
                    <div className="space-y-6">
                        {/* Customer Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Customer Name</Label>
                                <Input
                                    name={fields.customerName.name}
                                    key={fields.customerName.key}
                                    placeholder="Customer Name"
                                />
                                <p className="text-red-500 text-sm">{fields.customerName.errors}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Customer Email</Label>
                                <Input
                                    name={fields.customerEmail.name}
                                    key={fields.customerEmail.key}
                                    placeholder="customer@example.com"
                                />
                                <p className="text-red-500 text-sm">{fields.customerEmail.errors}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    name={fields.customerPhone.name}
                                    key={fields.customerPhone.key}
                                    placeholder="+1234567890"
                                />
                                <p className="text-red-500 text-sm">{fields.customerPhone.errors}</p>
                            </div>
                             {/* Delivery Date */}
                        <div>
                            <Label>Estimated Delivery Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[280px] text-left justify-start mt-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        {selectedDate ? (
                                            format(selectedDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => setSelectedDate(date || new Date())}
                                        disabled={(date) =>
                                            date <= new Date() || date > addMonths(new Date(), 6)
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        </div>
                        


                        {/* Order Items */}
                        <div>
                            <Label className="mb-4 block">Order Items</Label>
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                                    <div className="col-span-4">
                                        <Input
                                            name={`items.${index}.productId`}
                                            placeholder="Product ID"
                                            value={item.productId}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[index].productId = e.target.value;
                                                setItems(newItems);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            name={`items.${index}.quantity`}
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[index].quantity = parseInt(e.target.value);
                                                setItems(newItems);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            name={`items.${index}.unitPrice`}
                                            placeholder="Price"
                                            value={item.unitPrice}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[index].unitPrice = parseFloat(e.target.value);
                                                setItems(newItems);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Input
                                            name={`items.${index}.description`}
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[index].description = e.target.value;
                                                setItems(newItems);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeItem(index)}
                                            disabled={items.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-2"
                                onClick={addItem}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </div>

                        {/* Notes */}
                        <div>
                            <Label>Notes</Label>
                            <Textarea
                                name={fields.note.name}
                                key={fields.note.key}
                                placeholder="Add any additional notes here..."
                            />
                        </div>

                        {/* Total */}
                        <div className="flex justify-end">
                            <div className="w-1/3">
                                <div className="flex justify-between py-2 border-t">
                                    <span>Total Amount</span>
                                    <span className="font-medium">
                                        {formatCurrency({
                                            amount: calculateTotal(),
                                            currency: "INR",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-6">
                            <SubmitButton text="Create Order" />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}