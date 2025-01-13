import { Repository } from "typeorm";
import { Permission } from "../models/permission.model";
import { AppDataSource } from "../data-source";
import {
  PaginatedServiceResponseBuild,
  ResponsesHelper,
  ServiceCodeMap,
  ServiceResponseBuild,
} from "../helpers/responses";
import { UtilsHelper } from "../helpers/utils";
import { CreatePermissionDto } from "../dtos/permission/createPermission.dto";
import { PaginationRequestDto } from "../helpers/dtos/pagination-request.dto";
import { UpdatePermissionDto } from "../dtos/permission/updatePermission.dto";

export default class PermissionService {
  permissionRepository: Repository<Permission>;
  responseHelper: ResponsesHelper;
  utilsHelper: UtilsHelper;

  constructor() {
    this.permissionRepository = new Repository(
      Permission,
      AppDataSource.manager
    );
    this.responseHelper = new ResponsesHelper();
    this.utilsHelper = new UtilsHelper();
  }

  createPermission = async (
    permissionData: CreatePermissionDto
  ): Promise<ServiceResponseBuild> => {
    const existingModel = await this.permissionRepository.findOneBy({
      permissionModel: permissionData.permissionModel,
    });

    if (existingModel)
      return this.responseHelper.buildServiceResponse(
        {},
        "Model Already Has Permissions Connected",
        false,
        ServiceCodeMap.BAD_REQUEST
      );

    const permission = this.permissionRepository.create({
      permissionLevels: JSON.stringify(permissionData.permissionLevels),
      permissionModel: permissionData.permissionModel,
      permissionTitle: permissionData.permissionTitle,
    });

    await this.permissionRepository.save(permission, {
      reload: true,
    });

    return this.responseHelper.buildServiceResponse(
      permission,
      "Permission Created Successfully",
      true,
      ServiceCodeMap.CREATED
    );
  };

  getPermissions = async (
    paginationData: PaginationRequestDto
  ): Promise<PaginatedServiceResponseBuild> => {
    const allPermissions = await this.permissionRepository.find({
      order: {
        id: "DESC",
      },
      skip: paginationData.limit * (paginationData.page - 1),
      take: paginationData.limit,
    });

    const total_count = await this.permissionRepository.count();

    return this.responseHelper.buildPaginatedServiceResponse(
      allPermissions,
      total_count,
      "Permissions Fetched Successfully"
    );
  };

  getPermission = async (
    permissionId: number
  ): Promise<ServiceResponseBuild> => {
    const permission = await this.permissionRepository.findOneBy({
      id: permissionId,
    });

    if (!permission)
      return this.responseHelper.buildServiceResponse(
        {},
        "Permission Not Found",
        false,
        ServiceCodeMap.NOT_FOUND
      );

    return this.responseHelper.buildServiceResponse(
      permission,
      "Permission Fetched Successfully"
    );
  };

  editPermission = async (
    userId: number,
    updateData: UpdatePermissionDto
  ): Promise<ServiceResponseBuild> => {
    const userData = await this.getPermission(userId);

    if (userData.status == "failed") return userData;

    const permission = { ...userData.data, ...updateData };

    permission.permissionLevels = JSON.stringify(permission.permissionLevels);

    await this.permissionRepository.save(permission, { reload: true });

    return this.responseHelper.buildServiceResponse(
      permission,
      "Permission Updated Successfully"
    );
  };

  deletePermission = async (
    permissionId: number
  ): Promise<ServiceResponseBuild> => {
    this.permissionRepository.delete(permissionId);

    return this.responseHelper.buildServiceResponse(
      {},
      "Permission Deleted Successfully"
    );
  };
}
