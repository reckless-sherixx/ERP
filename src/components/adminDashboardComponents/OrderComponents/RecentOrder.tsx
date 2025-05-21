import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {prisma} from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";
async function getData(userId: string) {
    const data = await prisma.order.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            customerName: true,
            customerEmail: true,
            totalPrice: true,
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
    const data = await getData(session.user?.id as string);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
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