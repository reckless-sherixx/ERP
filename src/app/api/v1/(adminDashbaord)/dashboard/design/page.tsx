import { canCreateOrder } from "@/app/utils/dashboardAccess";
import { requireUser } from "@/app/utils/hooks";
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
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function OrdersRoute() {
    const session = await requireUser();
    if (!canCreateOrder(session.user?.role)) {
        redirect("/api/v1/dashboard");
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Designs</CardTitle>
                        <CardDescription>Upload and view your design work</CardDescription>
                    </div>
                    <Link href="/api/v1/dashboard/orders/create" className={buttonVariants()}>
                        <PlusIcon /> Upload work
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                    
                </Suspense>
            </CardContent>
        </Card>
    );
}