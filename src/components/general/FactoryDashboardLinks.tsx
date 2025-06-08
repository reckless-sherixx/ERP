"use client"
import { cn } from "@/lib/utils"
import { Role } from "@prisma/client"
import { HomeIcon, NotebookText, PersonStanding, ShoppingCart, Users2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const roleBasedLinks: Record<string, Role[]> = {
    dashboard: [Role.SYSTEM_ADMIN, Role.FACTORY_MANAGER],
    orders: [Role.SYSTEM_ADMIN, Role.FACTORY_MANAGER],
    taskAssignment: [Role.SYSTEM_ADMIN, Role.FACTORY_MANAGER],
    inventory: [Role.SYSTEM_ADMIN, Role.FACTORY_MANAGER, Role.INVENTORY_MANAGER],
    production:[Role.SYSTEM_ADMIN, Role.FACTORY_MANAGER, Role.PRODUCTION_STAFF],
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
        href: "/api/v1/factory/dashboard",
        icon: HomeIcon,
        roles: roleBasedLinks.dashboard,
    },
    {
        id: 2,
        name: 'Orders',
        href: '/api/v1/factory/dashboard/orders',
        icon: NotebookText,
        roles: roleBasedLinks.orders,
    },
    {
        id: 3,
        name: 'Task Assignment',
        href: '/api/v1/factory/dashboard/taskAssignment',
        icon: Users2,
        roles: roleBasedLinks.taskAssignment,
    },
    {
        id: 1,
        name: 'Inventory',
        href: '/api/v1/factory/dashboard/inventory',
        icon: ShoppingCart,
        roles: roleBasedLinks.inventory,
    },
    {
        id: 5,
        name: 'Production',
        href: '/api/v1/factory/dashboard/production',
        icon: PersonStanding,
        roles: roleBasedLinks.production,
    },
] as const ;

interface FactoryDashboardLinksProps {
    userRole: Role;
}

export function FactoryDashboardLinks({ userRole }: FactoryDashboardLinksProps) {
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