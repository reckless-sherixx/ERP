import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Loader2, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { Role } from "@prisma/client";

async function getData(userId: string, userRole: Role) {
    // Define the where clause based on user role
    const whereClause = userRole === Role.SYSTEM_ADMIN || userRole === Role.ADMIN
        ? {}
        : { 
            Assignee: {
                some: {
                    userId: userId
                }
            }
        };

    const [activeTasks, submittedWork, approvedWork, needsRevision] = await Promise.all([
        // Active Tasks
        prisma.order.count({
            where: {
                ...whereClause,
                status: "IN_PRODUCTION",
                DesignSubmission: {
                    none: {}
                }
            }
        }),
        // Submitted Work
        prisma.order.count({
            where: {
                ...whereClause,
                Assignee: {
                    some: {
                        status: "PENDING"
                    }
                }
            }
        }),
        // Approved Work
        prisma.order.count({
            where: {
                ...whereClause,
                Assignee: {
                    some: {
                        status: "APPROVED"
                    }
                }
            }
        }),
        // Needs Revision
        prisma.order.count({
            where: {
                ...whereClause,
                Assignee: {
                    some: {
                        status: "REVISION"
                    }
                }
            }
        })
    ]);

    return {
        activeTasks,
        submittedWork,
        approvedWork,
        needsRevision
    };
}

export async function DesignDashboardBlocks() {
    const session = await requireUser();
    const stats = await getData(
        session.user?.id as string,
        session.user?.role as Role
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                    <Loader2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeTasks}</div>
                    <p className="text-xs text-muted-foreground">1 in progress</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.submittedWork}</div>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.approvedWork}</div>
                    <p className="text-xs text-muted-foreground">Total submissions</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Needs Revision</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.needsRevision}</div>
                    <p className="text-xs text-muted-foreground">Requires updates</p>
                </CardContent>
            </Card>
        </div>
    );
}