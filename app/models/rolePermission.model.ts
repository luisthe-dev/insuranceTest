export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permissionLevel: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}