import { ReactNode } from "react";
import { auth, signOut } from "@/app/utils/auth";
import Link from "next/link";
import Logo from "../../../../../../public/logo.png";
import Image from "next/image";
import { DashboardLinks } from "@/components/general/DashboardLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { hasAdminDashboardAccess } from "@/app/utils/dashboardAccess";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { NotificationComponent } from "@/components/general/Notification";
import { requireUser } from "@/app/utils/hooks";

export default async function CustomerDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await requireUser();

    return (
        <>
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2">
                                <Image src={Logo} alt="Logo" className="size-7" />
                                <p className="text-2xl font-bold">
                                    PlyPicker<span className="text-blue-600">ERP</span>
                                </p>
                            </Link>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="grid gap-2 mt-15">
                                    <DashboardLinks userRole={session.user?.role as Role} />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center ml-auto gap-4">
                        <NotificationComponent />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="rounded-full"
                                        variant="outline"
                                        size="icon"
                                    >
                                        <User2 />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <form
                                            className="w-full"
                                            action={async () => {
                                                "use server";
                                                await signOut();
                                            }}
                                        >
                                            <button className="w-full text-left">Log out</button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>
                </div>
            <Toaster richColors closeButton theme="light" />
        </>
    );
}