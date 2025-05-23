import { accessToInventory } from "@/app/utils/dashboardAccess";
import { requireUser } from "@/app/utils/hooks";
import { InventoryList } from "@/components/factoryDashboardComponents/InventoryComponents/InventoryList";
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

export default async function InventoryRoute() {
    const session = await requireUser();
    if (!accessToInventory(session.user?.role)) {
        redirect("/api/v1/factory/dashboard");
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Inventory</CardTitle>
                        <CardDescription>Manage your inventory right here</CardDescription>
                    </div>
                    <Link href="/api/v1/factory/dashboard/inventory/create" className={buttonVariants()}>
                        <PlusIcon /> Add Material
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                    <InventoryList />
                </Suspense>
            </CardContent>
        </Card>
    );
}