import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OrderActions } from "./OrderActions";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../../general/EmptyState";
import { Role } from "@prisma/client";

async function getData(userId: string , userRole:Role) {
    if(userRole === Role.SYSTEM_ADMIN || userRole === Role.ADMIN){
        return await prisma.order.findMany({
            select: {
                id: true,
                customerName: true,
                totalPrice: true,
                createdAt: true,
                status: true,
                orderNumber: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    const data = await prisma.order.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            customerName: true,
            totalPrice: true,
            createdAt: true,
            status: true,
            orderNumber: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return data;
}
export async function OrderList() {
    const session = await requireUser();
    const data = await getData(session.user?.id as string , session.user?.role as Role);
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
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.orderNumber}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
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
                                    {new Intl.DateTimeFormat("en-IN", {
                                        timeZone: 'UTC',
                                        dateStyle: "medium",
                                    }).format(new Date(order.createdAt))}
                                </TableCell>
                                <TableCell className="text-right">
                                    <OrderActions id={order.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
}