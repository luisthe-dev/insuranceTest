export interface Permission {
  id: number;
  permissionTitle: string;
  permissionModel: string;
  permissionLevels: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}