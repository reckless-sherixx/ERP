import { TaskAssignment } from "@/components/adminDashboardComponents/AssignTaskComponents/TaskAssignment";
import { TaskList } from "@/components/adminDashboardComponents/AssignTaskComponents/TaskList";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function getData() {
    const data = await prisma.order.findMany({
        where: {
            isAssigned: false,
        },
        select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerEmail: true,
            customerAddress: true,
            attachment: true,
            status: true,
            createdAt: true,
            productId: true,
            itemDescription: true,
            totalPrice: true,
        },
    });
    return data;
}
export default async function TaskAssignmentPage() {
    const data = await getData();
    return (
        <Card className=" border border-black/20 shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Assign Tasks</CardTitle>
                        <CardDescription>Assign tasks to workers here</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <TaskAssignment initialData={data} />
                <Card className="border border-black/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Orders ({`${data.length}`})</CardTitle>
                        <CardDescription>Manage and assign customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Task List */}
                        <TaskList />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}