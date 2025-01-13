import { CreateRoleDto } from "./createRole.dto";

export interface UpdateRoleDto extends Omit<CreateRoleDto, "rolePermission"> {}