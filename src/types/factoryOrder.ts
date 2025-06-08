import { ProductionStatus } from "@prisma/client";

export interface FactoryOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    customerAddress: string;
    shippingAddress?: string | null;
    createdAt: Date;
    itemDescription: string;
    status: ProductionStatus;
    productId: string | null;
    productionStatus: ProductionStatus;
    attachment?: string | null;
    TaskAssignment?: {
        user: {
            name: string | null;
        };
    }[];
    DesignSubmission: {
        id: string;
        fileUrl: string | null;
        isApprovedByAdmin: boolean;
        isApprovedByCustomer: boolean;
    }[];
    isAssigned: boolean;
}