import { ReactNode } from "react";
import { requireUser } from "@/app/utils/hooks";
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
import { signOut } from "@/app/utils/auth";
import { Toaster } from "@/components/ui/sonner";
import { hasAdminDashboardAccess } from "@/app/utils/dashboardAccess";
import { redirect } from "next/navigation";
import { Role } from "@/types/roles";

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await requireUser();
    if (!hasAdminDashboardAccess(session.user?.role)) {
        redirect("/"); // Redirect to home or customer dashboard if unauthorized
    }
    return (
        <>
            <div className="grid min-h-screen w-full md:gird-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex flex-col max-h-screen h-full gap-2">
                        <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src={Logo} alt="Logo" className="size-7" />
                                <p className="text-2xl font-bold">
                                    PlyPicker<span className="text-blue-600">ERP</span>
                                </p>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                <DashboardLinks userRole={session.user?.role as Role} />
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="grid gap-2 mt-10">
                                    <DashboardLinks userRole={session.user?.role as Role} />
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center ml-auto">
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
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/api/v1/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/api/v1/orders">Orders</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/api/v1/Users">Users</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/api/v1/dashboard/invoices">Invoices</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
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
            </div>
            <Toaster richColors closeButton theme="light" />
        </>
    );
}