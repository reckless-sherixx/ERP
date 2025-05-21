import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, IndianRupee, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";

async function getData(userId: string) {
    const [data, pendingOrders, inProductionOrders, completedOrders] = await Promise.all([
        prisma.order.findMany({
            where: {
                userId: userId,
            },
            select: {
                totalPrice: true,
            },
        }),
        prisma.order.findMany({
            where: {
                userId: userId,
                status: "PENDING",
            },
            select: {
                id: true,
            },
        }),
        prisma.order.findMany({
            where: {
                userId: userId,
                status: "IN_PRODUCTION",
            },
            select: {
                id: true,
            },
        }),

        prisma.order.findMany({
            where: {
                userId: userId,
                status: "COMPLETED",
            },
            select: {
                id: true,
            },
        }),
    ]);

    return {
        data,
        pendingOrders,
        inProductionOrders,
        completedOrders,
    };
}

export async function DashboardBlocks() {
    const session = await requireUser();
    const { data, pendingOrders, inProductionOrders, completedOrders } = await getData(
        session.user?.id as string
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <IndianRupee className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">
                        {formatCurrency({
                            amount: data.reduce((acc, order) => acc + order.totalPrice, 0),
                            currency: "INR",
                        })}
                    </h2>
                    <p className="text-xs text-muted-foreground">Based on total volume</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Orders Created
                    </CardTitle>
                    <Users className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{data.length}</h2>
                    <p className="text-xs text-muted-foreground">Total Orders Created!</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                    <CreditCard className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{completedOrders.length}</h2>
                    <p className="text-xs text-muted-foreground">
                        Total Order which have been completed!
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Orders in Production
                    </CardTitle>
                    <Activity className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{inProductionOrders.length}</h2>
                    <p className="text-xs text-muted-foreground">
                        Orders which are currently in Production!
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Orders in Production
                    </CardTitle>
                    <Activity className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{pendingOrders.length}</h2>
                    <p className="text-xs text-muted-foreground">
                        Orders which are currently in Production!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}