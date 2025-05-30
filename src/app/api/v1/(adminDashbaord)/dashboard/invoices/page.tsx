import { canCreateInvoice } from "@/app/utils/dashboardAccess";
import { requireUser } from "@/app/utils/hooks";
import { InvoiceList } from "@/components/adminDashboardComponents/InvoiceComponents/InvoiceList";
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

export default async function InvoicesRoute() {
    const session = await requireUser();

    if(!canCreateInvoice(session.user?.role)) {
        redirect("/api/v1/dashboard");
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
                        <CardDescription>Manage your invoices right here</CardDescription>
                    </div>
                    <Link href="/api/v1/dashboard/invoices/create" className={buttonVariants()}>
                        <PlusIcon /> Create Invoice
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                    <InvoiceList />
                </Suspense>
            </CardContent>
        </Card>
    );
}