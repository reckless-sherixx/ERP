import { OrderList } from "@/components/adminDashboardComponents/OrderList";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function OrdersRoute() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Orders</CardTitle>
                        <CardDescription>Manage your orders right here</CardDescription>
                    </div>
                    <Link href="/api/v1/dashboard/orders/create" className={buttonVariants()}>
                        <PlusIcon /> Create Order
                    </Link>
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