import { TaskAssignment } from "@/components/adminDashboardComponents/DesignComponents/TaskAssignment";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
export default async function TaskAssignmentPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Assign Tasks</CardTitle>
                        <CardDescription>Assign tasks to workers here</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <TaskAssignment />
            </CardContent>
        </Card>
    )
}