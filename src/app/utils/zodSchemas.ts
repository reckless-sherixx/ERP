import { Role } from "@prisma/client";
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
    customerName: z.string().min(1, "Client name is required"),
    customerPhone: z.string().min(1, "Enter a valid mobile number"),
    customerEmail: z.string().email("Invalid Email address"),
    customerAddress: z.string().min(1, "Client address is required"),
    totalPrice: z.number().min(1, "1₹ is minimum"),
    status: z.enum(["PENDING", "IN_PRODUCTION", "COMPLETED", "CANCELED"]).default("PENDING"),
    productId:z.string().min(1,"Product Id required"),
    itemDescription: z.string().min(1, "Description is required"),
    itemQuantity: z.number().min(1, "Quantity min 1"),
    itemRate: z.number().min(1, "Rate min 1"),
    estimatedDelivery: z.string().min(1, "Date is required"),
    attachment:z.string().optional(),
    note: z.string().optional(),    
});

// Create a schema for role validation
export const updateRoleSchema = z.object({
    role: z.enum([
        Role.SYSTEM_ADMIN,
        Role.ADMIN,
        Role.FACTORY_MANAGER,
        Role.INVENTORY_MANAGER,
        Role.DESIGN,
        Role.PRODUCTION_STAFF,
        Role.SALES,
        Role.ACCOUNTING,
        Role.CUSTOMER
    ], {
        required_error: "Role is required",
        invalid_type_error: "Invalid role type"
    })
});


//Inventory Schema

export const inventorySchema = z.object({
    id: z.string().optional(),
    materialName: z.string().min(1, "Material name is required"),
    category:z.enum(["WOOD", "VENEERS", "HARDWARE","FINISHES","TOOLS"]),
    unit: z.string().min(1, "Unit of measurement is required"),
    currentStock: z.number().min(0, "Current stock cannot be negative"),
    reorderPoint: z.number().min(0, "Reorder point cannot be negative"),
    supplier: z.string().min(1, "Supplier name is required"),
});

