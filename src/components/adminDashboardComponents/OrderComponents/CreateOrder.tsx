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
import { useActionState, useState } from "react";
import { SubmitButton } from "../../general/SubmitButton";
import { createOrder } from "../../../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { orderSchema } from "@/app/utils/zodSchemas";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { UploadButton } from "@/components/general/UploadButton";


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
    const [rate, setRate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [productId, setProductId] = useState("");
    const [attachment, setAttachment] = useState<string>();

    const calculateTotal = (Number(quantity) || 0) * (Number(rate) || 0);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-IN", {
            timeZone: 'UTC',
            dateStyle: "long",
        }).format(date);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
                    <input
                        type="hidden"
                        name="estimatedDelivery"
                        value={selectedDate.toISOString()}
                    />
                    <input
                        type="hidden"
                        name="attachment"
                        value={attachment}
                    />
                    <input
                        type="hidden"
                        name="totalPrice"
                        value={calculateTotal}
                    />
                    <div className="flex gap-1 w-fit mb-6">
                        <Badge variant="secondary">New Order</Badge>
                    </div>
                    {/* Customer Information */}
                    <div className="flex pt-2">
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

                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">

                                <Label>Customer Phone</Label>
                                <Input
                                    name={fields.customerPhone.name}
                                    placeholder="Phone Number"
                                />
                                <p className="text-red-500 text-sm">{fields.customerPhone.errors}</p>
                                <Label>Customer Address</Label>
                                <Input
                                    name={fields.customerAddress.name}
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
                                            formatDate(selectedDate)
                                        ) : (
                                            <span>Pick a Date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        selected={selectedDate}
                                        onSelect={(date) => setSelectedDate(date || new Date())}
                                        mode="single"
                                        fromDate={new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Order Items */}
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
                                    defaultValue={fields.itemDescription.initialValue}
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

                    {/* Attachment */}
                    <div className="mb-6">
                        <UploadButton
                            onChange={(url:any) => setAttachment(url)}
                            value={attachment}
                        />
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
                            <SubmitButton text="Create Order" />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}