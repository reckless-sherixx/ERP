"use client";

import { ProductionTabs } from "./ProductionTabs";
import { Submission } from "@/types/submission";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/types/order";
import { DesignTabs } from "@/components/adminDashboardComponents/DesignComponents/DesignTabs";

interface ProductionDashboardContentProps {
    isAdminRole: boolean;
    submissions: Submission[];
    assignedTasks: Order[];
}

export function ProductionDashboardContent({ 
    isAdminRole, 
    submissions, 
    assignedTasks 
}: ProductionDashboardContentProps) {
    return (
        <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                <DesignTabs
                    assignedTasks={assignedTasks}
                    submissions={submissions}
                />
        </Suspense>
    );
}