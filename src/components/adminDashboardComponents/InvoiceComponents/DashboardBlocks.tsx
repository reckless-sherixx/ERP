import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, IndianRupee, Users } from "lucide-react";
import {prisma} from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Role } from "@prisma/client";

async function getData(userId: string , userRole: Role) {
     const whereClause = userRole === Role.SYSTEM_ADMIN || userRole === Role.ADMIN
            ? {}  // Empty where clause for admins to see all invoices
            : { userId: userId };  // Filter by userId for other invoices
    const [data, openInvoices, paidInvoices] = await Promise.all([
        prisma.invoice.findMany({
            where: whereClause,
            select: {
                total: true,
            },
        }),
        prisma.invoice.findMany({
            where: {
                ...whereClause,
                status: "PENDING",
            },
            select: {
                id: true,
            },
        }),

        prisma.invoice.findMany({
            where: {
                ...whereClause,
                status: "PAID",
            },
            select: {
                id: true,
            },
        }),
    ]);

    return {
        data,
        openInvoices,
        paidInvoices,
    };
}

export async function DashboardBlocks() {
    const session = await requireUser();
    const { data, openInvoices, paidInvoices } = await getData(
        session.user?.id as string , session.user?.role as Role
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
                            amount: data.reduce((acc, invoice) => acc + invoice.total, 0),
                            currency: "INR",
                        })}
                    </h2>
                    <p className="text-xs text-muted-foreground">Based on total volume</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Invoices Issued
                    </CardTitle>
                    <Users className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{data.length}</h2>
                    <p className="text-xs text-muted-foreground">Total Invoices Isued!</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
                    <CreditCard className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{paidInvoices.length}</h2>
                    <p className="text-xs text-muted-foreground">
                        Total Invoices which have been paid!
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Pending Invoices
                    </CardTitle>
                    <Activity className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">+{openInvoices.length}</h2>
                    <p className="text-xs text-muted-foreground">
                        Invoices which are currently pending!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}