//Access to use admin dashboard
export function hasAdminDashboardAccess(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN', 'ADMIN', 'SALES', 'DESIGN', 'ACCOUNTING'];
    return role ? allowedRoles.includes(role) : false;
}

//Access to create Invoices
export function canCreateInvoice(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN', 'ADMIN', 'ACCOUNTING'];
    return role ? allowedRoles.includes(role) : false;
}

//Access to create orders
export function canCreateOrder(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN', 'ADMIN', 'SALES'];
    return role ? allowedRoles.includes(role) : false;
}

//Access to all routes in admin dashboard
export function canEditInAdminDashboard(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN', 'ADMIN'];
    return role ? allowedRoles.includes(role) : false;
}

//Access to factory dashboard 
export function hasFactoryDashboardAccess(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN', 'FACTORY_MANAGER', 'INVENTORY_MANAGER', 'PRODUCTION_STAFF'];
    return role ? allowedRoles.includes(role) : false;
}

//Access to inventory
export function accessToInventory(role?: string): boolean {
    const allowedRoles = ['SYSTEM_ADMIN', 'FACTORY_MANAGER', 'INVENTORY_MANAGER'];
    return role ? allowedRoles.includes(role) : false;
}

export function accessDesignDashboard(role?:string):boolean{
    const allowedRoles = ['SYSTEM_ADMIN', 'ADMIN', 'DESIGN'];
    return role ? allowedRoles.includes(role) : false;
}

