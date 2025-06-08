"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionAssignedTasksCard } from "./ProductionAssignedTasksCard";
import { ProductionCard } from "./ProductionSubmissionCard";
import { OrderStatus } from "@prisma/client";
import { Submission } from "@/types/submission";

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string | null;
    customerAddress: string;
    createdAt: Date;
    itemDescription: string;
    totalPrice: number;
    status: OrderStatus;
    productId: string | null;
}

interface ProductionTabsProps {
    assignedTasks: Order[];
    submissions: Submission[];
}

export function ProductionTabs({ assignedTasks, submissions }: ProductionTabsProps) {
    return (
        <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="assigned" className="text-base">
                    Assigned Tasks ({assignedTasks.length})
                </TabsTrigger>
                <TabsTrigger value="submissions" className="text-base">
                    My Submissions ({submissions.length})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="assigned">
                <ProductionAssignedTasksCard initialData={assignedTasks} />
            </TabsContent>

            <TabsContent value="submissions">
                <ProductionCard submissions={submissions} />
            </TabsContent>
        </Tabs>
    );
}