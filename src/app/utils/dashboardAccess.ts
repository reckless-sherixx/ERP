//Access to use admin dashboard
export function hasAdminDashboardAccess(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN', 'ADMIN', 'SALES', 'DESIGN', 'ACCOUNTING'];
    return role ? allowedRoles.includes(role) : false;
}

//Access to create Invoices
export function canCreateInvoice(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN','ADMIN', 'ACCOUNTING'];
    return role ? allowedRoles.includes(role) : false;
}

//Access to create orders
export function canCreateOrder(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN','ADMIN', 'SALES'];
    return role ? allowedRoles.includes(role) : false;
}

//Access to all routes in admin dashboard
export function canEditInAdminDashboard(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN','ADMIN'];
    return role ? allowedRoles.includes(role) : false;
}

