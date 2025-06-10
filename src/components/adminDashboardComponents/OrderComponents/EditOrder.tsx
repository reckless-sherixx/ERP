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
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { SubmitButton } from "../../general/SubmitButton";
import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { orderSchema } from "@/app/utils/zodSchemas";
import { editOrder } from '@/actions';
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Order } from "@prisma/client";

interface EditOrderProps {
    data: Order;//get order data from prisma
}

export function EditOrder({ data }: EditOrderProps) {
    const [lastResult, action] = useActionState(editOrder, undefined);
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

    const [selectedDate, setSelectedDate] = useState(data.estimatedDelivery);
    const [rate, setRate] = useState(data.itemRate.toString());
    const [quantity, setQuantity] = useState(data.itemQuantity.toString());
    const [productId, setProductId] = useState(data.productId?.toString());

    const calculateTotal = (Number(quantity) || 0) * (Number(rate) || 0);
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
                    <input
                        type="hidden"
                        name={fields.estimatedDelivery.name}
                        value={selectedDate?.toISOString()}
                    />
                    {/* sending id with the formData */}
                    <input type="hidden" name="id" value={data.id} />

                    <input
                        type="hidden"
                        name={fields.totalPrice.name}
                        value={calculateTotal}
                    />

                    <div className="flex flex-col gap-1 w-fit mb-6">
                        <Badge variant="secondary">Edit Order</Badge>
                    </div>
                    <div className="flex pt-2">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label>Customer Name</Label>
                                <Input
                                    name={fields.customerName.name}
                                    key={fields.customerName.key}
                                    defaultValue={data.customerName}
                                    placeholder="Customer Name"
                                />
                                <p className="text-red-500 text-sm">{fields.customerName.errors}</p>

                                <Label>Customer Email</Label>
                                <Input
                                    name={fields.customerEmail.name}
                                    key={fields.customerEmail.key}
                                    defaultValue={data.customerEmail ?? ""}
                                    placeholder="customer@example.com"
                                />
                                <p className="text-red-500 text-sm">{fields.customerEmail.errors}</p>

                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">

                                <Label>Customer Phone</Label>
                                <Input
                                    name={fields.customerPhone.name}
                                    key={fields.customerPhone.key}
                                    defaultValue={data.customerPhone}
                                    placeholder="Phone Number"
                                />
                                <p className="text-red-500 text-sm">{fields.customerPhone.errors}</p>
                                <Label>Customer Address</Label>
                                <Input
                                    name={fields.customerAddress.name}
                                    key={fields.customerAddress.key}
                                    defaultValue={data.customerAddress}
                                    placeholder="Customer Address"
                                />
                                <p className="text-red-500 text-sm">{fields.customerAddress.errors}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div>
                                <Label>Est. Delivery Date</Label>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-[280px] text-left justify-start"
                                    >
                                        <CalendarIcon />

                                        {selectedDate ? (
                                            new Intl.DateTimeFormat("en-US", {
                                                dateStyle: "long",
                                            }).format(selectedDate)
                                        ) : (
                                            <span>Pick a Date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        selected={selectedDate || new Date()}
                                        onSelect={(date) => setSelectedDate(date || new Date())}
                                        mode="single"
                                        fromDate={new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-red-500 text-sm">{fields.estimatedDelivery.errors}</p>
                        </div>
                    </div>

                    <div>
                        <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
                            <p className="col-span-2">Product Id</p>
                            <p className="col-span-2">Quantity</p>
                            <p className="col-span-2">Rate</p>
                            <p className="col-span-6">Description</p>
                        </div>

                        <div className="grid grid-cols-12 gap-4 mb-4">
                            <div className="col-span-2">
                                <Input
                                    name={fields.productId.name}
                                    key={fields.productId.key}
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    type="string"
                                    placeholder="Enter Product ID"
                                />
                                <p className="text-red-500 text-sm">
                                    {fields.productId.errors}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    name={fields.itemQuantity.name}
                                    key={fields.itemQuantity.key}
                                    type="number"
                                    placeholder="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                                <p className="text-red-500 text-sm">
                                    {fields.itemQuantity.errors}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    name={fields.itemRate.name}
                                    key={fields.itemRate.key}
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    type="number"
                                    placeholder="0"
                                />
                                <p className="text-red-500 text-sm">
                                    {fields.itemRate.errors}
                                </p>
                            </div>
                            <div className="col-span-6">
                                <Textarea
                                    name={fields.itemDescription.name}
                                    key={fields.itemDescription.key}
                                    defaultValue={data.itemDescription}
                                    placeholder="Item name & description"
                                />
                                <p className="text-red-500 text-sm">
                                    {fields.itemDescription.errors}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                    <div className="flex justify-end">
                        <div className="w-1/3">
                            <div className="flex justify-between py-2 border-t">
                                <span>Total</span>
                                <span className="font-medium underline underline-offset-2">
                                    {formatCurrency({
                                        amount: calculateTotal,
                                        currency: "INR",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Note</Label>
                        <Textarea
                            name={fields.note.name}
                            key={fields.note.key}
                            defaultValue={fields.note.initialValue}
                            placeholder="Add your Note/s right here..."
                        />
                        <p className="text-red-500 text-sm">{fields.note.errors}</p>
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <div>
                            <SubmitButton text="Edit Order" />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}