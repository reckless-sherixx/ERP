"use client"
import { cn } from "@/lib/utils"
import { Role } from "@prisma/client"
import { CircleCheckBig, FileDiff, HomeIcon, NotebookIcon,NotebookText, Users2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const roleBasedLinks: Record<string, Role[]> = {
    dashboard: [Role.SYSTEM_ADMIN, Role.ADMIN , Role.SALES , Role.ACCOUNTING],
    orders: [Role.SYSTEM_ADMIN, Role.ADMIN, Role.SALES],
    users: [Role.SYSTEM_ADMIN, Role.ADMIN],
    invoices: [Role.SYSTEM_ADMIN, Role.ADMIN, Role.ACCOUNTING],
    design: [Role.SYSTEM_ADMIN, Role.ADMIN, Role.DESIGN],
    taskAssignment: [Role.SYSTEM_ADMIN, Role.ADMIN],
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
    {
        id: 5,
        name: 'Designs',
        href: '/api/v1/dashboard/design',
        icon: NotebookIcon,
        roles: roleBasedLinks.design,
    },
    {
        id: 4,
        name: 'TaskAssignment',
        href: '/api/v1/dashboard/taskAssignment',
        icon: CircleCheckBig,
        roles: roleBasedLinks.taskAssignment,
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
                            "flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:text-primary"
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