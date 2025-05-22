import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, IndianRupee, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";

import { Role } from "@prisma/client";

async function getData(userId: string, userRole: Role) {
    // Define the where clause based on user role
    const whereClause = userRole === Role.SYSTEM_ADMIN || userRole === Role.ADMIN
        ? {}  // Empty where clause for admins to see all orders
        : { userId: userId };  // Filter by userId for other roles

    const [data, pendingOrders, inProductionOrders, completedOrders] = await Promise.all([
        prisma.order.findMany({
            where: whereClause,
            select: {
                totalPrice: true,
                user: {
                    select: {
                        name: true,
                    }
                }
            },
        }),
        prisma.order.findMany({
            where: {
                ...whereClause,
                status: "PENDING",
            },
            select: {
                id: true,
            },
        }),
        prisma.order.findMany({
            where: {
                ...whereClause,
                status: "IN_PRODUCTION",
            },
            select: {
                id: true,
            },
        }),
        prisma.order.findMany({
            where: {
                ...whereClause,
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
        session.user?.id as string,
        session.user?.role as Role
    );

    const isAdmin = session.user?.role === Role.SYSTEM_ADMIN || session.user?.role === Role.ADMIN;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {isAdmin ? "Total Revenue (All Orders)" : "Total Revenue"}
                    </CardTitle>
                    <IndianRupee className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">
                        {formatCurrency({
                            amount: data.reduce((acc, order) => acc + order.totalPrice, 0),
                            currency: "INR",
                        })}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        {isAdmin ? "Revenue from all orders" : "Based on your orders"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {isAdmin ? "All Orders" : "Your Orders"}
                    </CardTitle>
                    <Users className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{data.length}</h2>
                    <p className="text-xs text-muted-foreground">
                        {isAdmin ? "Total orders in system" : "Total orders created by you"}
                    </p>
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
                        {isAdmin ? "All completed orders" : "Your completed orders"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders in Production</CardTitle>
                    <Activity className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{inProductionOrders.length}</h2>
                    <p className="text-xs text-muted-foreground">
                        {isAdmin ? "All orders in production" : "Your orders in production"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    <Activity className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{pendingOrders.length}</h2>
                    <p className="text-xs text-muted-foreground">
                        {isAdmin ? "All pending orders" : "Your pending orders"}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}