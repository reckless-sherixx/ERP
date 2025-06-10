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
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

interface DashboardPageProps {
    searchParams: Promise<{ view?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const session = await requireUser();

    // Redirect designers directly to design dashboard
    if (session.user.role === Role.DESIGN) {
        redirect('/api/v1/dashboard/design');
    }

    const params = await searchParams
    // Determine default view based on role
    const defaultView = session.user.role === Role.SALES ? "orders" 
        : session.user.role === Role.ACCOUNTING ? "invoices"
        : session.user.role === Role.FACTORY_MANAGER ? "factory"
        : "invoices";  // Default for admin and others
    
    const view = params.view || defaultView;

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
                        <h2 className="text-2xl font-bold">Factory Dashboard</h2>
                    </div>
                )}
            </Suspense>
        </div>
    );
}