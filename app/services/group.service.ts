import { Repository } from "typeorm";
import {
  PaginatedServiceResponseBuild,
  ResponsesHelper,
  ServiceCodeMap,
  ServiceResponseBuild,
} from "../helpers/responses";
import { UtilsHelper } from "../helpers/utils";
import PermissionService from "./permission.service";
import { Group } from "../models/group.model";
import { GroupPermission as GroupPermissionModel } from "../models/groupPermission.model";
import { AppDataSource } from "../data-source";
import { UpdateGroupDto } from "../dtos/group/updateGroup.dto";
import { PaginationRequestDto } from "../helpers/dtos/pagination-request.dto";
import { CreateGroupDto, GroupPermission } from "../dtos/group/createGroup.dto";
import { UpdateGroupPermissionDto } from "../dtos/group/updateGroupPermission.dto";
import { Permission } from "../models/permission.model";

export default class GroupService {
  groupRepository: Repository<Group>;
  responseHelper: ResponsesHelper;
  utilsHelper: UtilsHelper;
  groupPermissionRepository: Repository<GroupPermissionModel>;
  permissionService: PermissionService;

  constructor() {
    this.groupRepository = new Repository(Group, AppDataSource.manager);
    this.groupPermissionRepository = new Repository(
      GroupPermissionModel,
      AppDataSource.manager
    );
    this.responseHelper = new ResponsesHelper();
    this.utilsHelper = new UtilsHelper();
    this.permissionService = new PermissionService();
  }

  createGroup = async (
    groupData: CreateGroupDto
  ): Promise<ServiceResponseBuild> => {
    const existingGroup = await this.groupRepository.findOneBy({
      groupTitle: groupData.groupTitle,
    });

    if (existingGroup)
      return this.responseHelper.buildServiceResponse(
        {},
        `Group ${groupData.groupTitle} Has Already Been Set Up`,
        false,
        ServiceCodeMap.BAD_REQUEST
      );

    const group = this.groupRepository.create({
      groupTitle: groupData.groupTitle,
    });

    await this.groupRepository.save(group, {
      reload: true,
    });

    if (groupData.groupPermission && groupData.groupPermission.length > 0) {
      groupData.groupPermission.map(
        async (groupPermission: GroupPermission) => {
          let permissionData = await this.permissionService.getPermission(
            groupPermission.permissionId
          );

          if (permissionData.status == "failed") return;

          const permission = permissionData.data;

          if (
            JSON.parse(permission.permissionLevels).length <
            groupPermission.permissionLevel
          )
            return;

          const groupPermissionModel = this.groupPermissionRepository.create({
            permission: permission,
            group: group,
            permissionLevel: groupPermission.permissionLevel,
          });

          await this.groupPermissionRepository.save(groupPermissionModel, {
            reload: true,
          });
        }
      );
    }

    return this.responseHelper.buildServiceResponse(
      group,
      "Group Created Successfully",
      true,
      ServiceCodeMap.CREATED
    );
  };

  getGroups = async (
    paginationData: PaginationRequestDto
  ): Promise<PaginatedServiceResponseBuild> => {
    const groups = await this.groupRepository.find({
      order: {
        id: "DESC",
      },
      skip: paginationData.limit * (paginationData.page - 1),
      take: paginationData.limit,
    });

    const total_count = await this.groupRepository.count();

    return this.responseHelper.buildPaginatedServiceResponse(
      groups,
      total_count,
      "Groups Fetched Successfully"
    );
  };

  getGroup = async (groupId: number): Promise<ServiceResponseBuild> => {
    const group = await this.groupRepository.findOneBy({
      id: groupId,
    });

    if (!group)
      return this.responseHelper.buildServiceResponse(
        {},
        "Group Not Found",
        false,
        ServiceCodeMap.NOT_FOUND
      );

    let groupPermissions = await this.groupPermissionRepository.find({
      where: { group: { id: group.id } },
      relations: ["permission"],
    });

    groupPermissions.map((groupPermission: GroupPermissionModel) => {
      //@ts-ignore
      delete groupPermission.permission.permissionLevels;
      return groupPermission;
    });

    //@ts-ignore
    group.permissions = groupPermissions;

    return this.responseHelper.buildServiceResponse(
      group,
      "Group Fetched Successfully"
    );
  };

  editGroup = async (
    groupId: number,
    updateData: UpdateGroupDto
  ): Promise<ServiceResponseBuild> => {
    const groupData = await this.getGroup(groupId);

    if (groupData.status == "failed") return groupData;

    const group = { ...groupData.data };

    group.groupTitle = updateData.groupTitle;

    await this.groupRepository.save(group, { reload: true });

    return this.responseHelper.buildServiceResponse(
      group,
      "Group Updated Successfully"
    );
  };

  deleteGroup = async (groupId: number): Promise<ServiceResponseBuild> => {
    const groupPermissions = await this.groupPermissionRepository.find({
      where: { group: { id: groupId } },
    });

    groupPermissions.map((groupPermission: GroupPermissionModel) =>
      this.groupPermissionRepository.delete(groupPermission.id)
    );

    this.groupRepository.delete(groupId);

    return this.responseHelper.buildServiceResponse(
      {},
      "Group Deleted Successfully"
    );
  };

  editGroupPermission = async (
    groupId: number,
    updateData: UpdateGroupPermissionDto
  ): Promise<ServiceResponseBuild> => {
    let groupPermission: GroupPermissionModel | null = null;

    const groupData = await this.getGroup(groupId);
    const permissionData = await this.permissionService.getPermission(
      updateData.permissionId
    );

    if (groupData.status == "failed") return groupData;
    if (permissionData.status == "failed") return permissionData;

    const group: Group = groupData.data;
    const permission: Permission = permissionData.data;

    groupPermission = await this.groupPermissionRepository.findOne({
      where: {
        group: { id: groupId },
        permission: { id: updateData.permissionId },
      },
    });

    if (!groupPermission) {
      groupPermission = this.groupPermissionRepository.create({
        group: group,
        permission: permission,
        permissionLevel: updateData.permissionLevel,
      });
    }

    groupPermission.permissionLevel = updateData.permissionLevel;

    await this.groupPermissionRepository.save(groupPermission, {
      reload: true,
    });

    return this.responseHelper.buildServiceResponse(
      groupPermission,
      "Group Permissions Updated Successfully"
    );
  };

  deleteGroupPermission = async (
    id: number,
    permissionId: number
  ): Promise<ServiceResponseBuild> => {
    const groupData = await this.getGroup(id);
    const permissionData = await this.permissionService.getPermission(
      permissionId
    );

    if (groupData.status == "failed") return groupData;
    if (permissionData.status == "failed") return permissionData;

    const group: Group = groupData.data;
    const permission: Permission = permissionData.data;

    const groupPermission: GroupPermissionModel | null =
      await this.groupPermissionRepository.findOneBy({
        group: { id: group.id },
        permission: { id: permission.id },
      });

    if (groupPermission) {
      this.groupPermissionRepository.delete(groupPermission.id);
    }

    return this.responseHelper.buildServiceResponse(
      {},
      "Group Permissions Deleted Successfully"
    );
  };
}
