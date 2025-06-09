import { OrderStatus, ProductionStatus } from "@prisma/client";

interface OrderSubmission {
  id: string;
  fileUrl: string | null;
  createdAt: Date;
}

interface DesignSubmission {
  id: string;
  fileUrl: string | null;
  isApprovedByAdmin: boolean;
  isApprovedByCustomer: boolean;
}

interface TaskAssignment {
  id: string;
  status: ProductionStatus;
  userId:string;
  User: {
    name: string | null;
  };
  OrderSubmission?: OrderSubmission[];
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
