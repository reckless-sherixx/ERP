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

async function getData() {
    const session = await requireUser();
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const isAdmin = ["SYSTEM_ADMIN", "FACTORY_MANAGER"].includes(session.user.role);

    const data = await prisma.order.findMany({
        where: isAdmin ? {
            // Admin sees all tasks with submissions
            TaskAssignment: {
                some: {
                    status: {
                        in: ["PENDING", "CUTTING", "ASSEMBLY", "FINISHING"]
                    }
                }
            }
        } : {
            // Staff sees only their assigned tasks
            TaskAssignment: {
                some: {
                    userId: session.user.id,
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
            totalPrice: true,
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
    });

    return {
        data: data as ProductionSubmission[],
        isAdmin,
        userId: session.user.id
    };
}

export default async function ProductionPage() {
    const { data, isAdmin, userId } = await getData();
    
    if (!userId) {
        throw new Error("User Id is required");
    }
    return (
        <Card className="border border-black/20 shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Production Tasks</CardTitle>
                        <CardDescription>
                            {isAdmin ? "Manage all production tasks" : "Manage your assigned tasks"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ProductionTabs 
                    initialData={data} 
                    isAdmin={isAdmin}
                    userId={userId}
                />
            </CardContent>
        </Card>
    );
}