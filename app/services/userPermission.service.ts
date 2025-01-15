import { Repository } from "typeorm";
import { UserPermission } from "../models/userPermission.model";
import { AppDataSource } from "../data-source";
import { UpdateUserRoleDto } from "../dtos/userPermission/updateUserRole.dto";
import { ResponsesHelper, ServiceResponseBuild } from "../helpers/responses";
import RoleService from "./role.service";
import GroupService from "./group.service";
import PermissionService from "./permission.service";
import UserService from "./user.service";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Permission } from "../models/permission.model";
import { UpdateUserGroupDto } from "../dtos/userPermission/updateUserGroup.dto";
import { Group } from "../models/group.model";
import { UpdateUserPermissionDto } from "../dtos/userPermission/updateUserPermission.dto";

export class UserPermissionService {
  userPermissionRepository: Repository<UserPermission>;
  roleService: RoleService;
  responseHelper: ResponsesHelper;
  permissionService: PermissionService;
  userService: UserService;
  groupService: GroupService;

  constructor() {
    this.userPermissionRepository = new Repository(
      UserPermission,
      AppDataSource.manager
    );
    this.roleService = new RoleService();
    this.permissionService = new PermissionService();
    this.userService = new UserService();
    this.groupService = new GroupService();
    this.responseHelper = new ResponsesHelper();
  }

  updateUserRole = async (
    userId: number,
    updateData: UpdateUserRoleDto
  ): Promise<ServiceResponseBuild> => {
    const roleData = await this.roleService.getRole(updateData.roleId);
    const permissionData = await this.permissionService.getPermission(
      updateData.permissionId
    );
    const userData = await this.userService.getUser(userId);

    if (userData.status == "failed") return userData;
    if (roleData.status == "failed") return roleData;
    if (permissionData.status == "failed") return permissionData;

    let userPermission: UserPermission | null;

    const user: User = userData.data;
    const role: Role = roleData.data;
    const permission: Permission = permissionData.data;

    userPermission = await this.userPermissionRepository.findOne({
      where: {
        user: { id: user.id },
        permission: { id: permission.id },
      },
      relations: ["user", "permission", "group"],
    });

    if (!userPermission)
      userPermission = this.userPermissionRepository.create({
        role: role,
        permission: permission,
        user: user,
      });

    userPermission.role = role;

    await this.userPermissionRepository.save(userPermission, {
      reload: true,
    });

    //@ts-ignore
    delete userPermission?.user?.password;

    //@ts-ignore
    delete userPermission?.permission?.permissionLevels;

    //@ts-ignore
    delete userPermission?.group?.permissions;

    return this.responseHelper.buildServiceResponse(
      userPermission,
      "User Role Updated Successfully"
    );
  };

  updateUserGroup = async (
    userId: number,
    updateData: UpdateUserGroupDto
  ): Promise<ServiceResponseBuild> => {
    const groupData = await this.groupService.getGroup(updateData.groupId);
    const permissionData = await this.permissionService.getPermission(
      updateData.permissionId
    );
    const userData = await this.userService.getUser(userId);

    if (userData.status == "failed") return userData;
    if (groupData.status == "failed") return groupData;
    if (permissionData.status == "failed") return permissionData;

    let userPermission: UserPermission | null;

    const user: User = userData.data;
    const group: Group = groupData.data;
    const permission: Permission = permissionData.data;

    userPermission = await this.userPermissionRepository.findOne({
      where: {
        user: { id: user.id },
        permission: { id: permission.id },
      },
      relations: ["user", "permission", "role"],
    });

    if (!userPermission)
      userPermission = this.userPermissionRepository.create({
        group: group,
        permission: permission,
        user: user,
      });

    userPermission.group = group;

    await this.userPermissionRepository.save(userPermission, {
      reload: true,
    });

    //@ts-ignore
    delete userPermission?.user?.password;

    //@ts-ignore
    delete userPermission?.permission?.permissionLevels;

    //@ts-ignore
    delete userPermission?.group?.permissions;

    return this.responseHelper.buildServiceResponse(
      userPermission,
      "User Group Updated Successfully"
    );
  };

  updateUserPermission = async (
    userId: number,
    updateData: UpdateUserPermissionDto
  ): Promise<ServiceResponseBuild> => {
    const permissionData = await this.permissionService.getPermission(
      updateData.permissionId
    );
    const userData = await this.userService.getUser(userId);

    if (userData.status == "failed") return userData;
    if (permissionData.status == "failed") return permissionData;

    let userPermission: UserPermission | null;

    const user: User = userData.data;
    const permission: Permission = permissionData.data;

    const permissionLevels = JSON.parse(permission.permissionLevels);

    if (permissionLevels.length < updateData.permissionLevel) {
      return this.responseHelper.buildServiceResponse(
        {},
        "Invalid Permission Level",
        false,
        400
      );
    }

    userPermission = await this.userPermissionRepository.findOne({
      where: {
        user: { id: user.id },
        permission: { id: permission.id },
      },
      relations: ["user", "permission", "role"],
    });

    if (!userPermission)
      userPermission = this.userPermissionRepository.create({
        permission: permission,
        user: user,
        permissionLevel: updateData.permissionLevel,
      });

    userPermission.permissionLevel = updateData.permissionLevel;

    await this.userPermissionRepository.save(userPermission, {
      reload: true,
    });

    //@ts-ignore
    delete userPermission?.user?.password;

    //@ts-ignore
    delete userPermission?.permission?.permissionLevels;

    //@ts-ignore
    delete userPermission?.group?.permissions;

    return this.responseHelper.buildServiceResponse(
      userPermission,
      "User Group Updated Successfully"
    );
  };
}
