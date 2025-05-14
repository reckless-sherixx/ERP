import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/general/login-form";

const adminAuthorizedRoles = ['SYSTEM_ADMIN', 'ADMIN', 'SALES']

export default async function Login() {
    const session = await auth();

    if (session?.user) {
        redirect("/api/v1/dashboard");
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