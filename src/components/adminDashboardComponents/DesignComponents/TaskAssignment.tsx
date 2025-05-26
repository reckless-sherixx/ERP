import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "./TaskList";

async function getData() {
    const data = await prisma.order.findMany({
        where: {
            isAssigned: false,
        },
        select: {
            id: true,
            orderNumber: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            createdAt: true,
            productId: true,
            itemDescription: true,
            totalPrice: true,
        },
    });
    return data;
}

export async function TaskAssignment() {
    const data = await getData();
    return (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Available Orders for Assignment
                    </CardTitle>
                    <CardDescription>
                        Orders that need to be assigned to team members ({data.length} orders)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* UnAssigned Orders */}
                    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((order) => (
                            <div key={order.id} className="border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="font-medium">{order.orderNumber}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-muted-foreground">
                                                    Pending
                                                </span>
                                                •
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium">{order.user?.name}</h4>
                                    <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">Items ({order.itemDescription ? 1 : 0})</h4>
                                    <p className="text-sm text-muted-foreground">{order.itemDescription}</p>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-lg font-bold">
                                        ₹{order.totalPrice.toFixed(2)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button>
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Assign
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Orders ({`${data.length}`})</CardTitle>
                        <CardDescription>Manage and assign customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Task List */}
                    <TaskList />
                </CardContent>
            </Card>
        </>
    );
}