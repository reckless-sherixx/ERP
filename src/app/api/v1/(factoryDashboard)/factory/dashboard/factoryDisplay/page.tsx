import { prisma } from "@/lib/prisma";
import { FactoryOrderDisplay } from "@/components/factoryDashboardComponents/FactoryOrderDisplay/FactoryOrderDisplay";
import { ProductionSubmission } from "@/types/ProductionSubmission";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";

async function getData() {
    const data = await prisma.order.findMany({
        where: {
            TaskAssignment: {
                some: {}
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
    });

    const mappedData: ProductionSubmission[] = data.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerAddress: order.customerAddress,
        status: order.status,
        productionStatus: order.productionStatus,
        createdAt: order.createdAt,
        productId: order.productId,
        itemDescription: order.itemDescription,
        TaskAssignment: order.TaskAssignment.map(task => ({
            id: task.id,
            status: task.status,
            userId: task.userId ?? "",
            User: {
                name: task.User?.name ?? null
            },
            OrderSubmission: task.OrderSubmission?.map(submission => ({
                id: submission.id,
                fileUrl: submission.fileUrl,
                createdAt: submission.createdAt
            })) ?? []
        })),
        DesignSubmission: order.DesignSubmission?.map(design => ({
            id: design.id,
            fileUrl: design.fileUrl ?? null,
            isApprovedByAdmin: design.isApprovedByAdmin ?? false,
            isApprovedByCustomer: design.isApprovedByCustomer ?? false
        })) ?? []
    }));

    return mappedData;
}

export default async function FactoryDisplay() {
    const session = await auth();
    if(!session){
        redirect('/login')
    }
    const orders = await getData();

    return (
        <div className="container mx-auto p-6">
            <FactoryOrderDisplay orders={orders} />
        </div>
    );
}