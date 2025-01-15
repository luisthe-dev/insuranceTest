import { Request, Response } from "express";
import { UserPermissionService } from "../services/userPermission.service";
import { UpdateUserRoleDto } from "../dtos/userPermission/updateUserRole.dto";
import { ResponsesHelper } from "../helpers/responses";
import { UpdateUserGroupDto } from "../dtos/userPermission/updateUserGroup.dto";
import { UpdateUserPermissionDto } from "../dtos/userPermission/updateUserPermission.dto";

export default class userPermissionController {
  userPermissionService: UserPermissionService;
    responseHelper: ResponsesHelper;

  constructor() {
    this.userPermissionService = new UserPermissionService();
    this.responseHelper = new ResponsesHelper();
  }

  updateUserPermission = async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateData: UpdateUserPermissionDto = req.body;

    const response = await this.userPermissionService.updateUserPermission(
      +id,
      updateData
    );

    this.responseHelper.buildControllerResponse(response, res);};

  updateUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateData: UpdateUserRoleDto = req.body;

    const response = await this.userPermissionService.updateUserRole(
      +id,
      updateData
    );

    this.responseHelper.buildControllerResponse(response, res);
  };

  updateUserGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateData: UpdateUserGroupDto = req.body;

    const response = await this.userPermissionService.updateUserGroup(
      +id,
      updateData
    );

    this.responseHelper.buildControllerResponse(response, res);
};
}