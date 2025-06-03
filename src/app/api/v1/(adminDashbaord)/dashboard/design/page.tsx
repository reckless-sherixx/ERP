import { requireUser } from "@/app/utils/hooks";
import { DesignTabs } from "@/components/adminDashboardComponents/DesignComponents/DesignTabs";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

async function getData() {
    const session = await requireUser();
    const userId = session.user.id;

    const [assignedTasks, submissions] = await Promise.all([
        // Fetch assigned tasks
        prisma.order.findMany({
            where: {
                Assignee: {
                    some: {
                        userId: userId
                    }
                },
                status: {
                    in: ["PENDING", "IN_PRODUCTION"]
                },
                DesignSubmission: {
                    none: {}  
                }
            },
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                customerEmail: true,
                customerAddress: true,
                attachment: true,
                status: true,
                Assignee:{
                    select: {
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                createdAt: true,
                productId: true,
                itemDescription: true,
                totalPrice: true,
            },
        }),
        // Fetch submissions
       prisma.order.findMany({
            where: {
                Assignee: {
                    some: {
                        userId: userId
                    }
                },
                status: {
                    in: ["COMPLETED", "IN_PRODUCTION"]
                }
            },
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                customerEmail: true,
                customerAddress: true,
                status: true,
                createdAt: true,
                productId: true,
                itemDescription: true,
                totalPrice: true,
                Assignee:{
                    select: {
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                DesignSubmission: {
                    select: {
                        fileUrl: true,
                        comment: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    ]);

    return {
        assignedTasks,
        submissions
    };
}

export default async function DesignRoute() {
    const data = await getData();
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">My Design Tasks</CardTitle>
                        <CardDescription>Manage your assigned tasks and submissions</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                    <DesignTabs 
                        assignedTasks={data.assignedTasks}
                        submissions={data.submissions}
                    />
                </Suspense>
            </CardContent>
        </Card>
    );
}