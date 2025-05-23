import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { InventoryActions } from "./InventoryActions";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../../general/EmptyState";

async function getData() {
    const data = await prisma.order.findMany({
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


export async function InventoryList() {
    const session = await requireUser();
    const data = await getData();
    return (
        <>
            {data.length === 0 ? (
                <EmptyState
                    title="No materials found"
                    description="Input material stock"
                    buttontext="Add Material"
                    href="inventory/create"
                />
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Material ID</TableHead>
                            <TableHead>Material Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Reorder Point</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Status</TableHead>
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
                                    <InventoryActions status={order.status} id={order.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
}