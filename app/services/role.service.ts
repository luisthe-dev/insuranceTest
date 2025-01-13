import { Repository } from "typeorm";
import { Role } from "../models/role.model";
import {
  PaginatedServiceResponseBuild,
  ResponsesHelper,
  ServiceCodeMap,
  ServiceResponseBuild,
} from "../helpers/responses";
import { UtilsHelper } from "../helpers/utils";
import { AppDataSource } from "../data-source";
import { CreateRoleDto, RolePermission } from "../dtos/role/createRole.dto";
import { RolePermission as RolePermissionModel } from "../models/rolePermission.model";
import PermissionService from "./permission.service";
import { PaginationRequestDto } from "../helpers/dtos/pagination-request.dto";
import { UpdateRoleDto } from "../dtos/role/updateRole.dto";

export default class RoleService {
  roleRepository: Repository<Role>;
  responseHelper: ResponsesHelper;
  utilsHelper: UtilsHelper;
  rolePermissionRepository: Repository<RolePermissionModel>;
  permissionService: PermissionService;

  constructor() {
    this.roleRepository = new Repository(Role, AppDataSource.manager);
    this.rolePermissionRepository = new Repository(
      RolePermissionModel,
      AppDataSource.manager
    );
    this.responseHelper = new ResponsesHelper();
    this.utilsHelper = new UtilsHelper();
    this.permissionService = new PermissionService();
  }

  createRole = async (
    roleData: CreateRoleDto
  ): Promise<ServiceResponseBuild> => {
    const existingRole = await this.roleRepository.findOneBy({
      roleTitle: roleData.roleTitle,
    });

    if (existingRole)
      return this.responseHelper.buildServiceResponse(
        {},
        `Role ${roleData.roleTitle} Has Already Been Set Up`,
        false,
        ServiceCodeMap.BAD_REQUEST
      );

    const role = this.roleRepository.create({
      roleTitle: roleData.roleTitle,
    });

    await this.roleRepository.save(role, {
      reload: true,
    });

    if (roleData.rolePermission && roleData.rolePermission.length > 0) {
      roleData.rolePermission.map(async (rolePermission: RolePermission) => {
        let permissionData = await this.permissionService.getPermission(
          rolePermission.permissionId
        );

        if (permissionData.status == "failed") return;

        const permission = permissionData.data;

        if (
          JSON.parse(permission.permissionLevels).length <
          rolePermission.permissionLevel
        )
          return;

        const rolePermissionModel = this.rolePermissionRepository.create({
          permission: permission,
          role: role,
          permissionLevel: rolePermission.permissionLevel,
        });

        await this.rolePermissionRepository.save(rolePermissionModel, {
          reload: true,
        });
      });
    }

    return this.responseHelper.buildServiceResponse(
      role,
      "Role Created Successfully",
      true,
      ServiceCodeMap.CREATED
    );
  };

  getRoles = async (
    paginationData: PaginationRequestDto
  ): Promise<PaginatedServiceResponseBuild> => {
    const roles = await this.roleRepository.find({
      order: {
        id: "DESC",
      },
      skip: paginationData.limit * (paginationData.page - 1),
      take: paginationData.limit,
    });

    const total_count = await this.roleRepository.count();

    return this.responseHelper.buildPaginatedServiceResponse(
      roles,
      total_count,
      "Roles Fetched Successfully"
    );
  };

  getRole = async (roleId: number): Promise<ServiceResponseBuild> => {
    const role = await this.roleRepository.findOneBy({
      id: roleId,
    });

    if (!role)
      return this.responseHelper.buildServiceResponse(
        {},
        "Role Not Found",
        false,
        ServiceCodeMap.NOT_FOUND
      );

    let rolePermissions = await this.rolePermissionRepository.find({
      where: { role: { id: role.id } },
      relations: ["permission"],
    });

    rolePermissions.map((rolePermission) => {
      //@ts-ignore
      delete rolePermission.permission.permissionLevels;
      return rolePermission;
    });

    //@ts-ignore
    role.permissions = rolePermissions;

    return this.responseHelper.buildServiceResponse(
      role,
      "Role Fetched Successfully"
    );
  };

  editRole = async (
    roleId: number,
    updateData: UpdateRoleDto
  ): Promise<ServiceResponseBuild> => {
    const roleData = await this.getRole(roleId);

    if (roleData.status == "failed") return roleData;

    const role = { ...roleData.data };

    role.roleTitle = updateData.roleTitle;

    await this.roleRepository.save(role, { reload: true });

    return this.responseHelper.buildServiceResponse(
      role,
      "Role Updated Successfully"
    );
  };

  deleteRole = async (roleId: number): Promise<ServiceResponseBuild> => {
    const rolePermissions = await this.rolePermissionRepository.find({ where: { role: { id: roleId } } });

    rolePermissions.map(rolePermissions => this.rolePermissionRepository.delete(rolePermissions.id));

    this.roleRepository.delete(roleId);

    return this.responseHelper.buildServiceResponse(
      {},
      "Role Deleted Successfully"
    );
  };
}

