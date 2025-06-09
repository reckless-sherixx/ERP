"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionSubmission } from "@/types/ProductionSubmission";
import { ProductionTaskList } from "./ProductionTaskList";

interface ProductionTabsProps {
    initialData: ProductionSubmission[];
    isAdmin: boolean;
    userId: string;
}

export function ProductionTabs({ initialData, isAdmin, userId }: ProductionTabsProps) {
    // Filter functions for different task states
    const getAssignedTasks = () => initialData.filter(order => 
        order.TaskAssignment?.some(task => task.userId === userId)
    );

    const getPendingTasks = () => initialData.filter(order => 
        order.productionStatus === "PENDING"
    );

    const getCuttingTasks = () => initialData.filter(order => 
        order.productionStatus === "CUTTING"
    );

    const getAssemblyTasks = () => initialData.filter(order => 
        order.productionStatus === "ASSEMBLY"
    );

    const getFinishedTasks = () => initialData.filter(order => 
        order.productionStatus === "FINISHING"
    );

    return (
        <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
                {isAdmin ? (
                    // Admin view tabs
                    <>
                        <TabsTrigger value="all" className="text-base">
                            All Tasks ({initialData.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="text-base">
                            Pending ({getPendingTasks().length})
                        </TabsTrigger>
                        <TabsTrigger value="cutting" className="text-base">
                            Cutting ({getCuttingTasks().length})
                        </TabsTrigger>
                        <TabsTrigger value="assembly" className="text-base">
                            Assembly ({getAssemblyTasks().length})
                        </TabsTrigger>
                        <TabsTrigger value="finished" className="text-base">
                            Finished ({getFinishedTasks().length})
                        </TabsTrigger>
                    </>
                ) : (
                    // Staff view tabs
                    <>
                        <TabsTrigger value="assigned" className="text-base">
                            My Tasks ({getAssignedTasks().length})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="text-base">
                            Pending ({getPendingTasks().length})
                        </TabsTrigger>
                        <TabsTrigger value="cutting" className="text-base">
                            Cutting ({getCuttingTasks().length})
                        </TabsTrigger>
                        <TabsTrigger value="assembly" className="text-base">
                            Assembly ({getAssemblyTasks().length})
                        </TabsTrigger>
                        <TabsTrigger value="finished" className="text-base">
                            Finished ({getFinishedTasks().length})
                        </TabsTrigger>
                    </>
                )}
            </TabsList>

            {isAdmin ? (
                // Admin view content
                <>
                    <TabsContent value="all">
                        <ProductionTaskList initialData={initialData} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                    <TabsContent value="pending">
                        <ProductionTaskList initialData={getPendingTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                    <TabsContent value="cutting">
                        <ProductionTaskList initialData={getCuttingTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                    <TabsContent value="assembly">
                        <ProductionTaskList initialData={getAssemblyTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                    <TabsContent value="finished">
                        <ProductionTaskList initialData={getFinishedTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                </>
            ) : (
                // Staff view content
                <>
                    <TabsContent value="assigned">
                        <ProductionTaskList initialData={getAssignedTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                    <TabsContent value="pending">
                        <ProductionTaskList initialData={getPendingTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                    <TabsContent value="cutting">
                        <ProductionTaskList initialData={getCuttingTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                    <TabsContent value="assembly">
                        <ProductionTaskList initialData={getAssemblyTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                    <TabsContent value="finished">
                        <ProductionTaskList initialData={getFinishedTasks()} isAdmin={isAdmin} userId={userId} />
                    </TabsContent>
                </>
            )}
        </Tabs>
    );
}