import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../../general/EmptyState";
import { FactoryTaskActions } from "./FactoryTaskActions";

async function getData() {
    const data = await prisma.order.findMany({
        where:{
            DesignSubmission: {
                some: {
                    isApprovedByAdmin: true,
                    isApprovedByCustomer: true
                }
            },
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
            DesignSubmission: {
                select: {
                    id: true,
                    fileUrl: true,
                    isApprovedByAdmin: true,
                    isApprovedByCustomer: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            TaskAssignment: {
                select: {
                    id: true,
                    status: true,
                    userId: true,
                    User: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return data;
}

export async function FactoryTaskList() {
    const data = await getData();
    return (
        <>
            {data.length === 0 ? (
                <EmptyState
                    title="No orders found"
                    description="Create an order to get started"
                    buttontext="Create order"
                    href="orders/create"
                />
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="pb-4">#{order.orderNumber}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell> {order.itemDescription && order.itemDescription.length > 10
                                    ? `${order.itemDescription.slice(0, 10)}...`
                                    : order.itemDescription}</TableCell>
                                <TableCell>
                                    <Badge>{order.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {order.TaskAssignment?.[0]?.User?.name || "Not Assigned"}
                                </TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat("en-IN", {
                                        timeZone: 'UTC',
                                        dateStyle: "medium",
                                    }).format(new Date(order.createdAt))}
                                </TableCell>
                                <TableCell className="text-right">
                                    <FactoryTaskActions
                                        id={order.id}
                                        order={{
                                            id: order.id,
                                            orderNumber: order.orderNumber,
                                            customerName: order.customerName,
                                            customerEmail: order.customerEmail ?? "",
                                            customerAddress: order.customerAddress,
                                            createdAt: order.createdAt,
                                            itemDescription: order.itemDescription,
                                            status: order.status, 
                                            productId: order.productId,
                                            productionStatus: order.productionStatus,
                                            DesignSubmission: order.DesignSubmission.map(design => ({
                                                id: design.id,
                                                fileUrl: design.fileUrl,
                                                isApprovedByAdmin: Boolean(design.isApprovedByAdmin),
                                                isApprovedByCustomer: Boolean(design.isApprovedByCustomer)
                                            })),
                                            TaskAssignment: order.TaskAssignment?.map(assignment => ({
                                                id: assignment.id,
                                                status: assignment.status,
                                                userId: assignment.userId as string,
                                                User: {
                                                    name: assignment.User?.name ?? null
                                                }
                                            })) ?? [],
                                            isAssigned: order.TaskAssignment.length > 0,
                                            attachment: null
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
}