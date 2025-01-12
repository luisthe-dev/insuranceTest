export interface GroupPermission {
  id: number;
  groupId: number;
  permissionId: number;
  permissionLevel: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}