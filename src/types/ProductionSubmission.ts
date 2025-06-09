import { OrderStatus, ProductionStatus } from "@prisma/client";

interface TaskAssignment {
    id: string;
    status: ProductionStatus;
    userId: string | null;
    User: {
        name: string | null;
    } | null;
    OrderSubmission: {
        id: string;
        fileUrl: string | null;
        createdAt: Date;
    }[];
}

interface DesignSubmission {
    id: string;
    fileUrl: string | null;
    isApprovedByAdmin: boolean | null;
    isApprovedByCustomer: boolean | null;
}

export interface ProductionSubmission {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    customerAddress: string;
    status: OrderStatus;
    productionStatus: ProductionStatus;
    createdAt: Date;
    productId: string | null;
    itemDescription: string;
    TaskAssignment: TaskAssignment[];
    DesignSubmission: DesignSubmission[];
}
