import { DesignStatus, OrderStatus } from "@prisma/client";

export interface Submission {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    customerAddress: string;
    status: OrderStatus;
    createdAt: Date;
    productId: string | null; 
    itemDescription: string;
    totalPrice: number;
    Assignee: {
        id: string;
        status: DesignStatus;
        user: {
            name: string | null;
        };
    }[];
    DesignSubmission: {
        id: string;
        fileUrl: string;
        comment: string;
        isApprovedByCustomer: boolean;
        isApprovedByAdmin: boolean;
        createdAt: Date;
    }[];
}