import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../../general/EmptyState";
import { TaskActions } from "./TaskActions";



async function getData() {
    const data = await prisma.order.findMany({
        select: {
            id: true,
            customerName: true,
            customerAddress: true,
            customerEmail: true,
            itemDescription: true,
            totalPrice: true,
            createdAt: true,
            status: true,
            orderNumber: true,
            Assignee: {
                select: {
                    user: {
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
export async function TaskList() {
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
                            <TableHead>Amount</TableHead>
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
                                    {formatCurrency({
                                        amount: order.totalPrice,
                                        currency: "INR",
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Badge>{order.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {order.Assignee?.[0]?.user?.name || "Not Assigned"}
                                </TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat("en-IN", {
                                        timeZone: 'UTC',
                                        dateStyle: "medium",
                                    }).format(new Date(order.createdAt))}
                                </TableCell>
                                <TableCell className="text-right">
                                    <TaskActions
                                        id={order.id}
                                        order={{
                                            orderNumber: order.orderNumber,
                                            customerName: order.customerName,
                                            customerEmail:order.customerEmail ?? "",
                                            customerAddress: order.customerAddress,
                                            createdAt: order.createdAt,
                                            itemDescription: order.itemDescription,
                                            totalPrice: order.totalPrice,
                                            status: order.status,
                                            shippingAddress: order.customerAddress,
                                            Assignee:order.Assignee,
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