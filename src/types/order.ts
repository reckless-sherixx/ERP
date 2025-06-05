import { DesignStatus, OrderStatus } from "@prisma/client";

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    customerAddress: string;
    shippingAddress?: string;
    createdAt: Date;
    itemDescription: string;
    totalPrice: number;
    status: OrderStatus;
    productId: string | null;
    attachment?: string | null; 
    Assignee?: {
        id: string;
        status: DesignStatus;
        userId: string;
        user: {
            name: string | null;
        };
    }[];
}