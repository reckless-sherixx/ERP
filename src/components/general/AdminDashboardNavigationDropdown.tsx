"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter, useSearchParams } from "next/navigation"
import { Role } from "@prisma/client"



const dashboards = [
    {
        value: "orders",
        label: "Order Dashboard",
        roles: [Role.SYSTEM_ADMIN, Role.ADMIN, Role.SALES],
        href: "/api/v1/dashboard?view=orders"
    },
    {
        value: "invoices",
        label: "Invoice Dashboard",
        roles: [Role.SYSTEM_ADMIN, Role.ADMIN, Role.ACCOUNTING],
        href: "/api/v1/dashboard?view=invoices"
    },
    {
        value: "factory",
        label: "Factory Dashboard",
        roles: [Role.SYSTEM_ADMIN, Role.ADMIN, Role.FACTORY_MANAGER],
        href: "/api/v1/dashboard?view=factory"
    }
] as const;

interface AdminDashboardNavigationDropdownProps {
    userRole: Role;
}

export function AdminDashboardNavigationDropdown({ userRole }: AdminDashboardNavigationDropdownProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view") || "orders";
    
    const [open, setOpen] = React.useState(false);

    // Filter dashboards based on user role
    const availableDashboards = dashboards.filter(dashboard => 
        dashboard.roles.includes(userRole as any)
    );

    // Don't render if user has no access to any dashboard
    if (availableDashboards.length === 0) return null;

    const currentDashboard = dashboards.find(d => d.value === currentView);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {currentDashboard?.label || "Select Dashboard..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search dashboard..." />
                    <CommandList>
                        <CommandEmpty>No dashboard found.</CommandEmpty>
                        <CommandGroup>
                            {availableDashboards.map((dashboard) => (
                                <CommandItem
                                    key={dashboard.value}
                                    value={dashboard.value}
                                    onSelect={() => {
                                        router.push(dashboard.href);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentView === dashboard.value 
                                                ? "opacity-100" 
                                                : "opacity-0"
                                        )}
                                    />
                                    {dashboard.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}