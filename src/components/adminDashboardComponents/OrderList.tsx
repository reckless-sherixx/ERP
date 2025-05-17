import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import { OrderActions } from "./OrderActions";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

async function getData() {
    const data = await prisma.order.findMany({
        include: {
            customer: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return data;
}

export async function OrderList() {
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
                            <TableHead>Order Number</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead>Est. Delivery</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.orderNumber}</TableCell>
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>
                                    <Badge>{order.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat("en-IN", {
                                        timeZone: 'UTC',
                                        dateStyle: "medium",
                                    }).format(new Date(order.createdAt))}
                                </TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat("en-IN", {
                                        timeZone: 'UTC',
                                        dateStyle: "medium",
                                    }).format(new Date(order.estimatedDelivery))}
                                </TableCell>
                                <TableCell className="text-right">
                                    <OrderActions status={order.status} id={order.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
}