import { CreatePermissionDto } from "./createPermission.dto";

export interface UpdatePermissionDto extends Omit<CreatePermissionDto, ""> {}