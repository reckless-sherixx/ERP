import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Role } from "@prisma/client";
async function getData(userId: string, userRole: Role) {
    const where = userRole === Role.SYSTEM_ADMIN || userRole === Role.ADMIN
        ? {}  // Empty where clause to get all orders
        : { userId: userId };
    const data = await prisma.invoice.findMany({
        where,
        select: {
            id: true,
            clientName: true,
            clientEmail: true,
            total: true,
            currency: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 7,
    });

    return data;
}

export async function RecentInvoices() {
    const session = await requireUser();
    const data = await getData(session.user?.id as string , session.user?.role as Role);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                {data.map((item) => (
                    <div className="flex items-center gap-4" key={item.id}>
                        <Avatar className="hidden sm:flex size-9">
                            <AvatarFallback>{item.clientName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium leadin-none">
                                {item.clientName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {item.clientEmail}
                            </p>
                        </div>
                        <div className="ml-auto font-medium">
                            +
                            {formatCurrency({
                                amount: item.total,
                                currency: "INR",
                            })}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}