import { ProductionTaskList } from "@/components/factoryDashboardComponents/TaskSubmissionComponents/ProductionTaskList";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ProductionSubmission } from "@/types/ProductionSubmission";
import { requireUser } from "@/app/utils/hooks";
import { ProductionTabs } from "@/components/factoryDashboardComponents/TaskSubmissionComponents/DesignTabs";
import { ProductionOverview } from "@/components/factoryDashboardComponents/FactoryDashboardComponents/ProductionOverview";
import { redirect } from "next/navigation";
import { hasFactoryDashboardAccess } from "@/app/utils/dashboardAccess";

async function getData() {
    const session = await requireUser();

    if (!session?.user?.id || !hasFactoryDashboardAccess(session.user.role)) {
        redirect("/api/v1/dashboard");
    }

    const [productionData, inventoryData] = await Promise.all([
        prisma.order.findMany({
            where: {
                TaskAssignment: {
                    some: {
                        status: {
                            in: ["PENDING", "CUTTING", "ASSEMBLY", "FINISHING"]
                        }
                    }
                }
            },
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                customerEmail: true,
                customerAddress: true,
                status: true,
                productionStatus: true,
                createdAt: true,
                productId: true,
                itemDescription: true,
                TaskAssignment: {
                    select: {
                        id: true,
                        status: true,
                        userId: true,
                        User: {
                            select: {
                                name: true
                            }
                        },
                        OrderSubmission: {
                            select: {
                                id: true,
                                fileUrl: true,
                                createdAt: true
                            }
                        }
                    }
                },
                DesignSubmission: {
                    select: {
                        id: true,
                        fileUrl: true,
                        isApprovedByAdmin: true,
                        isApprovedByCustomer: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        }),
        prisma.inventoryItem.findMany({
            select: {
                id: true,
                stockStatus: true,
            }
        })
    ]);

    const mappedProduction: ProductionSubmission[] = productionData.map(order => ({
        ...order,
        TaskAssignment: order.TaskAssignment.map(task => ({
            ...task,
            User: task.User || null,
            OrderSubmission: task.OrderSubmission || []
        })),
        DesignSubmission: order.DesignSubmission || []
    }));

    return {
        data: {
            production: mappedProduction,
            inventory: inventoryData
        },
        userId: session.user.id
    };
}

export default async function DashboardPage() {
    const session = await requireUser();
    
    if (!hasFactoryDashboardAccess(session.user.role)) {
        redirect("/api/v1/dashboard");
    }

    const { data, userId } = await getData();
    
    if (!userId) {
        throw new Error("User Id is required");
    }

    return (
        <div className="space-y-6">
            <ProductionOverview 
                data={data.production} 
                inventoryData={data.inventory}
                userId={userId} 
            />
        </div>
    );
}