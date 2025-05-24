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
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../../general/EmptyState";

async function getData() {
    const data = await prisma.inventoryItem.findMany({
        select: {
            id: true,
            materialName: true,
            currentStock: true,
            reorderPoint: true,
            stockStatus: true,
            category: true,
            materialId: true,
            supplier: true,
            unit: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return data;
}


export async function InventoryList() {
    await requireUser();
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
                            <TableHead>Status</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Updated On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>#{item.materialId}</TableCell>
                                <TableCell>{item.materialName}</TableCell>
                                <TableCell>
                                    {item.category.replace("_", " ")}
                                </TableCell>
                                <TableCell>
                                    {item.currentStock} {item.unit.replace("_", " ")}
                                </TableCell>
                                <TableCell>
                                    {item.reorderPoint} {item.unit.replace("_", " ")}
                                </TableCell>
                                <TableCell>
                                    <Badge>{item.stockStatus}</Badge>
                                </TableCell>
                                <TableCell>
                                    {item.supplier}
                                </TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat("en-IN", {
                                        timeZone: 'UTC',
                                        dateStyle: "medium",
                                    }).format(new Date(item.createdAt))}
                                </TableCell>
                                <TableCell className="text-right">
                                    <InventoryActions status={item.stockStatus} id={item.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
}