export interface CreateRoleDto {
  roleTitle: string;
  rolePermission: RolePermission[];
}

export interface RolePermission {
    permissionId: number;
    permissionLevel: number;
}