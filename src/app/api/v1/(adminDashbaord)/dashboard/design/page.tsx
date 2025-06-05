import { accessDesignDashboard } from "@/app/utils/dashboardAccess";
import { requireUser } from "@/app/utils/hooks";
import { DesignDashboardBlocks } from "@/components/adminDashboardComponents/DesignComponents/DesignDashboardBlocks";
import { DesignDashboardContent } from "@/components/adminDashboardComponents/DesignComponents/DesignDashboardComponent";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Order } from "@/types/order";
import { Submission } from "@/types/submission";
import { DesignStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";


async function getData(userRole: Role) {
    const session = await requireUser();
    const userId = session.user.id;
    const isAdminRole = userRole === Role.SYSTEM_ADMIN || userRole === Role.ADMIN;

    // Fetch assigned tasks (for designers only)
    const assignedTasks = !isAdminRole ? await prisma.order.findMany({
        where: {
            Assignee: {
                some: {
                    userId: userId,
                    OR: [
                        {
                            status: DesignStatus.PENDING
                        },
                        {
                            status: DesignStatus.REVISION
                        }
                    ]
                }
            },
            status: {
                in: ["PENDING", "IN_PRODUCTION"]
            },
        },
        select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerEmail: true,
            customerAddress: true,
            attachment: true,
            status: true,
            Assignee: {
                select: {
                    id: true,
                    status: true,
                    userId: true, // Added userId
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
    }) : [];

    // Fetch submissions based on role
   const submissions = isAdminRole
    ? await prisma.order.findMany({
        where: {
            DesignSubmission: {
                some: {
                    OR: [
                        { isApprovedByAdmin: false },
                        {
                            isApprovedByAdmin: true,
                            Assignee: {
                                status: DesignStatus.REVISION
                            }
                        }
                    ]
                }
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
                Assignee: {
                    select: {
                        id: true,
                        status: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                DesignSubmission: {
                    select: {
                        id: true,
                        fileUrl: true,
                        comment: true,
                        isApprovedByAdmin: true,
                        isApprovedByCustomer: true,
                        createdAt: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        })
        : await prisma.order.findMany({
            where: {
                Assignee: {
                    some: {
                        userId: userId
                    }
                },
                DesignSubmission: {
                    some: {}
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
                attachment: true,
                Assignee: {
                    select: {
                        id: true,
                        status: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                DesignSubmission: {
                    select: {
                        id: true,
                        fileUrl: true,
                        comment: true,
                        isApprovedByAdmin: true,
                        isApprovedByCustomer: true,
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
        });

    return {
        assignedTasks: assignedTasks as Order[],
        submissions: submissions as Submission[],
        isAdminRole
    };
}

export default async function DesignRoute() {
    const session = await requireUser();
    if (!accessDesignDashboard(session.user?.role)) {
        redirect('/api/v1/dashboard')
    }
    const data = await getData(session.user?.role as Role);
    const isAdminRole = session.user?.role === Role.SYSTEM_ADMIN || session.user?.role === Role.ADMIN;

    return (
        <>
            <div className="space-y-6">
                <DesignDashboardBlocks />
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                {isAdminRole ? "Design Submissions Review" : "My Design Tasks"}
                            </CardTitle>
                            <CardDescription>
                                {isAdminRole
                                    ? "Review and manage design submissions"
                                    : "Manage your assigned tasks and submissions"}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DesignDashboardContent
                        isAdminRole={isAdminRole}
                        submissions={data.submissions}
                        assignedTasks={data.assignedTasks}
                    />
                </CardContent>
            </Card>
        </>
    );
}