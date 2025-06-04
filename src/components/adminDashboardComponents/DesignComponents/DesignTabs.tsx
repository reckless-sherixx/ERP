"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignedTasksCard } from "./AssignedTasksCard";
import { SubmissionsCard } from "./SubmissionCard";
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

interface DesignTabsProps {
    assignedTasks: Order[];
    submissions: Submission[];
}

export function DesignTabs({ assignedTasks, submissions }: DesignTabsProps) {
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
                <AssignedTasksCard initialData={assignedTasks} />
            </TabsContent>

            <TabsContent value="submissions">
                <SubmissionsCard submissions={submissions} />
            </TabsContent>
        </Tabs>
    );
}