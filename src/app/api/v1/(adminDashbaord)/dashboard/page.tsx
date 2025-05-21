import { Suspense } from "react";
import { requireUser } from "@/app/utils/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDashboardNavigationDropdown } from "@/components/general/AdminDashboardNavigationDropdown";
import { DashboardBlocks as InvoiceDashboard } from "@/components/adminDashboardComponents/InvoiceComponents/DashboardBlocks";
import { DashboardBlocks as OrderDashboard } from "@/components/adminDashboardComponents/OrderComponents/DashboardBlocks";
import { InvoiceGraph } from "@/components/adminDashboardComponents/InvoiceComponents/InvoiceGraph";
import { OrderGraph } from "@/components/adminDashboardComponents/OrderComponents/OrderGraph";
import { RecentInvoices } from "@/components/adminDashboardComponents/InvoiceComponents/RecentInvoice";
import { canEditInAdminDashboard } from "@/app/utils/dashboardAccess";
import { RecentOrders } from "@/components/adminDashboardComponents/OrderComponents/RecentOrder";

interface PageProps {
    searchParams: { view?: string }
}

export default async function DashboardRoute({ searchParams }: PageProps) {
    const session = await requireUser();
    const view = searchParams.view || "invoices";

    return (
        <div className="space-y-6">
            {/* Only show dashboard switcher for admin users */}
            {canEditInAdminDashboard(session.user.role) && (
                <div className="flex justify-end">
                    <AdminDashboardNavigationDropdown userRole={session.user.role} />
                </div>
            )}

            <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
                {view === "invoices" && (
                    <>
                        <InvoiceDashboard />
                        <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
                            <InvoiceGraph />
                            <RecentInvoices />
                        </div>
                    </>
                )}

                {view === "orders" && (
                    <>
                        <OrderDashboard />
                        <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
                            <OrderGraph />
                            <RecentOrders/>
                        </div>
                    </>
                )}

                {view === "factory" && (
                    <div className="grid gap-4">
                        {/* Add factory dashboard components */}
                        <h2 className="text-2xl font-bold">Factory Dashboard</h2>
                        {/* Add factory-specific metrics and graphs */}
                    </div>
                )}
            </Suspense>
        </div>
    );
}