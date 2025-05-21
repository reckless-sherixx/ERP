"use client"
import { cn } from "@/lib/utils"
import { Role } from "@prisma/client"
import { FileDiff, HomeIcon, NotebookText, Users2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const roleBasedLinks: Record<string, Role[]> = {
    dashboard: [Role.SYSTEM_ADMIN, Role.ADMIN],
    orders: [Role.SYSTEM_ADMIN, Role.ADMIN, Role.SALES],
    users: [Role.SYSTEM_ADMIN, Role.ADMIN],
    invoices: [Role.SYSTEM_ADMIN, Role.ADMIN, Role.ACCOUNTING],
};

interface DashboardLink {
    id: number;
    name: string;
    href: string;
    icon: React.ElementType;
    roles: Role[];
}

export const dashboardLinks: DashboardLink[] = [
    {
        id: 0,
        name: 'Dashboard',
        href: "/api/v1/dashboard",
        icon: HomeIcon,
        roles: roleBasedLinks.dashboard,
    },
    {
        id: 2,
        name: 'Orders',
        href: '/api/v1/dashboard/orders',
        icon: NotebookText,
        roles: roleBasedLinks.orders,
    },
    {
        id: 3,
        name: 'Users',
        href: '/api/v1/dashboard/users',
        icon: Users2,
        roles: roleBasedLinks.users,
    },
    {
        id: 1,
        name: 'Invoices',
        href: '/api/v1/dashboard/invoices',
        icon: FileDiff,
        roles: roleBasedLinks.invoices,
    },
]

interface DashboardLinksProps {
    userRole: Role;
}

export function DashboardLinks({ userRole }: DashboardLinksProps) {
    const pathname = usePathname();
    return (
        <>
            {dashboardLinks
                .filter(link => link.roles.includes(userRole))
                .map((link) => (
                    <Link
                        className={cn(
                            pathname === link.href
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground",
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                        )}
                        href={link.href}
                        key={link.id}
                    >
                        <link.icon className="size-4" />
                        {link.name}
                    </Link>
                ))
            }
        </>
    )
}