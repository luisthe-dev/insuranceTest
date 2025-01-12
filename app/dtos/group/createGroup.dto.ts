export interface CreateGroupDto {
  groupTitle: string;
  groupPermission: GroupPermission[];
}

export interface GroupPermission {
  permissionId: number;
  permissionLevel: number;
}
