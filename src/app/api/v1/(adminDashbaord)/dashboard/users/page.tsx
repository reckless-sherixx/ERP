import { canEditInAdminDashboard } from "@/app/utils/dashboardAccess";
import { requireUser } from "@/app/utils/hooks";
import { UsersList } from "@/components/adminDashboardComponents/UserComponents/UsersList";
import { redirect } from "next/navigation";

export default async function UsersRoute(){
    const session = await requireUser();
    if(!canEditInAdminDashboard(session.user.role)){
        redirect("/api/v1/dashboard");
    }
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">
                Manage your users and their access to the dashboard.
            </p>
            <div className="mt-5">
            <UsersList/>
            </div>
        </div>
    )
}