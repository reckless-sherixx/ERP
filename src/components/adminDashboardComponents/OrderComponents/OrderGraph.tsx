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

async function getOrders(userId: string) {
    const rawData = await prisma.order.findMany({
        where: {
            userId: userId,
            createdAt: {
                lte: new Date(),
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        },
        select: {
            createdAt: true,
            totalPrice: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    //Group and aggregate data by date
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
    //Convert to array and from the object
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
    const data = await getOrders(session.user?.id as string);

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