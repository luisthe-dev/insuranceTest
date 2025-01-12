export interface UserPermission {
  id: number;
  userId: number;
  permissionId: number;
  groupId: number;
  roleId: number;
  permissionLevel: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}