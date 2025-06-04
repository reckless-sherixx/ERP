import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/general/login-form";
import { hasAdminDashboardAccess } from "../utils/dashboardAccess";


export default async function Login() {
    const session = await auth();

    if (session?.user) {
        // Check if user has admin dashboard access
        if (hasAdminDashboardAccess(session.user.role)) {
            redirect("/api/v1/dashboard");
        } else {
             redirect("/api/v1/customerDashboard"); // if user is not any of the authorized roles, then redirect him to customer dashboard 
        }
    }
    return (
        <>
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <LoginForm />
                </div>
            </div>
        </>
    );
}