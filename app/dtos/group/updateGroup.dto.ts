import { CreateGroupDto } from "./createGroup.dto";

export interface UpdateGroupDto extends Omit<CreateGroupDto, "rolePermission"> {}