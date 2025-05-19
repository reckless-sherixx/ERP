import { z } from "zod";

export const onboardingSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    address: z.string().min(2, "Address is required"),
});

export const invoiceSchema = z.object({
    invoiceName: z.string().min(1, "Invoice Name is required"),
    total: z.number().min(1, "1$ is minimum"),
    status: z.enum(["PAID", "PENDING"]).default("PENDING"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.number().min(0, "Due Date is required"),
    fromName: z.string().min(1, "Your name is required"),
    fromEmail: z.string().email("Invalid Email address"),
    fromAddress: z.string().min(1, "Your address is required"),
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Invalid Email address"),
    clientAddress: z.string().min(1, "Client address is required"),
    currency: z.string().min(1, "Currency is required"),
    invoiceNumber: z.number().min(1, "Minimum invoice number of 1"),
    note: z.string().optional(),
    invoiceItemDescription: z.string().min(1, "Description is required"),
    invoiceItemQuantity: z.number().min(1, "Qunatity min 1"),
    invoiceItemRate: z.number().min(1, "Rate min 1"),
});

export const orderSchema = z.object({
    customerName: z.string().min(2, "Name must be at least 2 characters"),
    customerEmail: z.string().email("Invalid email address"),
    customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.object({
        line1: z.string().min(1, "Address line 1 is required"),
        line2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        instructions: z.string().optional(),
    }),
    estimatedDelivery: z.string().datetime({
        message: "Estimated delivery date is required",
    }),
    items: z.array(z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Price cannot be negative"),
        description: z.string().optional(),
        specifications: z.record(z.any()).optional(),
        assignedToId: z.string().optional(),
        timeline: z.record(z.any()).optional()
    })).min(1, "At least one item is required"),
    note: z.string().optional(),
    status: z.enum(["PENDING", "IN_PRODUCTION", "COMPLETED", "CANCELED"]).default("PENDING")
});