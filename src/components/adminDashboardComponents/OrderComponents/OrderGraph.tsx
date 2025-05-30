import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Graph } from "../../general/Graph";
import {prisma} from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { Role } from "@prisma/client";

async function getOrders(userId: string, userRole: Role) {
    const where = userRole === Role.SYSTEM_ADMIN || userRole === Role.ADMIN
        ? {
            createdAt: {
                lte: new Date(),
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        }
        : {
            userId: userId,
            createdAt: {
                lte: new Date(),
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        };

    const rawData = await prisma.order.findMany({
        where,
        select: {
            createdAt: true,
            totalPrice: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const aggregatedData = rawData.reduce(
        (acc: { [key: string]: number }, curr) => {
            const date = new Date(curr.createdAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
            });
            acc[date] = (acc[date] || 0) + curr.totalPrice;
            return acc;
        },
        {}
    );

    const transformedData = Object.entries(aggregatedData)
        .map(([date, amount]) => ({
            date,
            amount,
            originalDate: new Date(date + ", " + new Date().getFullYear()),
        }))
        .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
        .map(({ date, amount }) => ({
            date,
            amount,
        }));

    return transformedData;
}

export async function OrderGraph() {
    const session = await requireUser();
    const data = await getOrders(session.user?.id as string , session.user?.role as Role);

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Total Orders</CardTitle>
                <CardDescription>
                    Order which have been created in the last 30 days.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Graph data={data} />
            </CardContent>
        </Card>
    );
}