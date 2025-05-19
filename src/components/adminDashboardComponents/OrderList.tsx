import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../general/EmptyState";
import { OrderActions } from "./OrderActions";

async function getData() {
    const orders = await prisma.order.findMany({
        include: {
            customer: true,
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return orders;
}
function calculateOrderTotal(items: any[]) {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
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
                            <TableHead>Items</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.orderNumber}</TableCell>
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>{order.items.length} items</TableCell>
                                <TableCell>
                                    ${calculateOrderTotal(order.items).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <OrderActions status={order.status} id={order.id} />
                                </TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat("en-IN", {
                                        dateStyle: "medium",
                                    }).format(order.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <OrderActions id={order.id} status={order.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
}