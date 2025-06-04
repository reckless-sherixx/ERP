"use client";

import { AdminDesignReview } from "./AssignDesignReview";
import { DesignTabs } from "./DesignTabs";
import { Submission } from "@/types/submission";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DesignDashboardContentProps {
    isAdminRole: boolean;
    submissions: Submission[];
    assignedTasks: any[];
}

export function DesignDashboardContent({ 
    isAdminRole, 
    submissions, 
    assignedTasks 
}: DesignDashboardContentProps) {
    return (
        <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
            {isAdminRole ? (
                <AdminDesignReview submissions={submissions} />
            ) : (
                <DesignTabs
                    assignedTasks={assignedTasks}
                    submissions={submissions}
                />
            )}
        </Suspense>
    );
}