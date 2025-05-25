import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {prisma} from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Role } from "@prisma/client";
async function getData(userId: string, userRole: Role) {
    const where = userRole === Role.SYSTEM_ADMIN || userRole === Role.ADMIN
        ? {}  // Empty where clause to get all orders
        : { userId: userId };

    const data = await prisma.order.findMany({
        where,
        select: {
            id: true,
            customerName: true,
            customerEmail: true,
            totalPrice: true,
            user: {
                select: {
                    name: true,
                }
            },
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 7,
    });

    return data;
}

export async function RecentOrders() {
    const session = await requireUser();
    const data = await getData(session.user?.id as string , session.user?.role);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                {data.map((item) => (
                    <div className="flex items-center gap-4" key={item.id}>
                        <Avatar className="hidden sm:flex size-9">
                            <AvatarFallback>{item.customerName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium leadin-none">
                                {item.customerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {item.customerEmail}
                            </p>
                        </div>
                        <div className="ml-auto font-medium">
                            +
                            {formatCurrency({
                                amount: item.totalPrice,
                                currency:"INR",
                            })}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}