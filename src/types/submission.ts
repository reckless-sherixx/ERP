import { DesignStatus, OrderStatus } from "@prisma/client";

interface DesignSubmission {
    id: string;
    fileUrl: string;
    comment: string;
    isApprovedByAdmin: boolean;
    isApprovedByCustomer: boolean;
    createdAt: Date;
}

interface Assignee {
    id: string;
    status: DesignStatus;
    user: {
        name: string;  
    };
}

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
    Assignee: Assignee[];
    DesignSubmission: DesignSubmission[];
}