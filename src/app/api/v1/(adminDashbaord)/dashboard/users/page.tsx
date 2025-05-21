import { UsersList } from "@/components/adminDashboardComponents/UserComponents/UsersList";

export default async function UsersRoute(){
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