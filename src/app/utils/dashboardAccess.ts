
export function hasAdminDashboardAccess(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN', 'ADMIN', 'SALES', 'DESIGN', 'ACCOUNTING'];
    return role ? allowedRoles.includes(role) : false;
}

export function canCreateInvoice(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN','ADMIN', 'ACCOUNTING'];
    return role ? allowedRoles.includes(role) : false;
}