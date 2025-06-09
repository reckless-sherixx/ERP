import { OrderStatus, ProductionStatus } from "@prisma/client";

export interface FactoryOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    customerAddress: string;
    createdAt: Date;
    itemDescription: string;
    status: OrderStatus;
    productionStatus: ProductionStatus;
    productId: string | null;
    attachment?: string | null;
    isAssigned:boolean;
    TaskAssignment?: {
        id: string;
        status: ProductionStatus;
        userId: string;
        User: {
            name: string | null;
        };
    }[];
    OrderSubmission?: {
        id: string;
        fileUrl: string | null;
        createdAt: Date;
    }[];
    DesignSubmission?: {
        id: string;
        fileUrl: string | null;
        isApprovedByAdmin: boolean;
        isApprovedByCustomer: boolean;
    }[];
}