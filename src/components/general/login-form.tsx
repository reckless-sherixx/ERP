import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/logo.png"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';
import { SubmitButton } from "@/components/general/SubmitButton";
import { auth, signIn } from "@/app/utils/auth";
import { redirect } from "next/navigation";


export default async function LoginForm() {
    const session = await auth();

    if (session?.user) {
        return redirect("/api/v1/dashboard")
    }
    return (
        <div className="flex items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center self-center">
                    <Image
                        src={Logo}
                        alt="ERP Logo"
                        width={50}
                        height={50}
                        className="mr-2"
                    />
                    <h1 className="text-2xl font-bold ">
                        PlyPicker<span className="text-primary">ERP</span>
                    </h1>
                </Link>
                <div className="flex flex-col gap-6">
                    <Card className="border border-black/15 bg-background shadow-md">
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">
                                Welcome Back
                            </CardTitle>
                            <CardDescription>
                                Login with your Google account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <form action={async () => {
                                    "use server"
                                    await signIn("google", {
                                        redirectTo: "/api/v1/dashboard"
                                    })
                                }}>
                                    <SubmitButton
                                        variant="outline"
                                        text="Login With Google"
                                        width="w-full"
                                        icon={<FcGoogle className="mr-2 size-5" />}
                                    />
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}