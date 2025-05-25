import { canCreateOrder } from "@/app/utils/dashboardAccess";
import { requireUser } from "@/app/utils/hooks";
import { OrderList } from "@/components/factoryDashboardComponents/OrderComponents/OrderList";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function OrdersRoute() {
    const session = await requireUser();
    if (!canCreateOrder(session.user?.role)) {
        redirect("/api/v1/factory/dashboard");
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Orders</CardTitle>
                        <CardDescription>Order to be manufactured</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                    <OrderList />
                </Suspense>
            </CardContent>
        </Card>
    );
}