import { FactoryTaskAssignment } from "@/components/factoryDashboardComponents/AssignTaskComponents/FactoryTaskAssignment";
import { FactoryTaskList } from "@/components/factoryDashboardComponents/AssignTaskComponents/FactoryTaskList";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function getData() {
    const data = await prisma.order.findMany({
        where: {
            DesignSubmission: {
                some: {
                    isApprovedByAdmin: true,
                    isApprovedByCustomer: true
                }
            },
            isAssigned: false,
            productionStatus: "PENDING"
        },
        select: {
            id: true,
            customerName: true,
            customerAddress: true,
            customerEmail: true,
            itemDescription: true,
            createdAt: true,
            status: true,
            orderNumber: true,
            productId: true,
            productionStatus: true,
            TaskAssignment: {
                select: {
                    id: true,
                    status: true,
                    userId: true,
                    User: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            DesignSubmission: {
                where: {
                    isApprovedByAdmin: true,
                    isApprovedByCustomer: true
                },
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

    return data.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerAddress: order.customerAddress,
        createdAt: order.createdAt,
        itemDescription: order.itemDescription,
        status: order.status, 
        productionStatus: order.productionStatus,
        productId: order.productId,
        DesignSubmission: order.DesignSubmission.map(design => ({
            id: design.id,
            fileUrl: design.fileUrl,
            isApprovedByAdmin: true,
            isApprovedByCustomer: true
        })),
        TaskAssignment: order.TaskAssignment?.map(assignment => ({
            id: assignment.id,
            status: assignment.status,
            userId: assignment.userId ?? "",
            User: {
                name: assignment.User?.name ?? null
            }
        })) ?? [],
        attachment: null
    }));
}
export default async function TaskAssignmentPage() {
    const data = await getData();
    return (
        <Card className=" border border-black/20 shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Assign Tasks</CardTitle>
                        <CardDescription>Assign tasks to workers here</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <FactoryTaskAssignment initialData={data} />
                <Card className="border border-black/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Orders</CardTitle>
                        <CardDescription>Manage and assign customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Task List */}
                        <FactoryTaskList />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}