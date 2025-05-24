import { requireUser } from "@/app/utils/hooks";
import { EmptyState } from "@/components/general/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { UsersActions } from "./UsersActions";
import { Badge } from "@/components/ui/badge";

type UserData = {
    id: string;
    role: Role;
    name: string | null;
    email: string | null;
    createdAt: Date;
}

type RoleVariant = 'default' | 'secondary' | 'outline' | 'destructive';

    const ROLE_VARIANTS: Record<Role, { variant: RoleVariant; label: string }> = {
        SYSTEM_ADMIN: { variant: 'default', label: 'System Admin' },
        ADMIN: { variant: 'secondary', label: 'Admin' },
        FACTORY_MANAGER: { variant: 'outline', label: 'Factory Manager' },
        INVENTORY_MANAGER: { variant: 'outline', label: 'Inventory Manager' },
        DESIGN: { variant: 'outline', label: 'Design Team' },
        PRODUCTION_STAFF: { variant: 'outline', label: 'Production Staff' },
        SALES: { variant: 'outline', label: 'Sales Team' },
        ACCOUNTING: { variant: 'outline', label: 'Accounting' },
        CUSTOMER: { variant: 'destructive', label: 'Customer' }
    } as const;

async function getData() {
    const data = await prisma.user.findMany({
        select: {
            id: true,
            role: true,
            name: true,
            email: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Group users by role with proper typing
    const groupedUsers = data.reduce((acc, user) => {
        if (!acc[user.role]) {
            acc[user.role] = [];
        }
        acc[user.role].push(user);
        return acc;
    }, {} as Record<Role, UserData[]>);

    // Ensure all roles are represented
    Object.values(Role).forEach(role => {
        if (!groupedUsers[role]) {
            groupedUsers[role] = [];
        }
    });

    return groupedUsers;
}

export async function UsersList() {
    const session = await requireUser();
    const groupedUsers = await getData();
    const roles = Object.keys(groupedUsers) as Role[];

    return (
        <Tabs defaultValue={roles[0]} className="w-full">
            <TabsList className="mb-4">
                {roles.map((role) => (
                    <TabsTrigger key={role} value={role}>
                        {ROLE_VARIANTS[role].label}
                        <span className="ml-2 text-xs">
                            ({groupedUsers[role].length})
                        </span>
                    </TabsTrigger>
                ))}
            </TabsList>

            {roles.map((role) => (
                <TabsContent key={role} value={role}>
                    {groupedUsers[role].length === 0 ? (
                        <EmptyState
                            title={`No ${ROLE_VARIANTS[role].label.toLowerCase()} users found`}
                            description="Manage access levels of users in the dashboard."
                            buttontext="Manage Users"
                            href="users"
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groupedUsers[role].map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name || 'N/A'}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={ROLE_VARIANTS[user.role].variant as any}
                                                className="capitalize"
                                            >
                                                {ROLE_VARIANTS[user.role].label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.DateTimeFormat("en-IN", {
                                                timeZone: 'UTC',
                                                dateStyle: "medium",
                                            }).format(new Date(user.createdAt))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <UsersActions
                                                id={user.id}
                                                role={user.role}
                                                currentUserRole={session.user.role}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TabsContent>
            ))}
        </Tabs>
    );
}