import { Request, Response } from "express";
import { CreatePermissionDto } from "../dtos/permission/createPermission.dto";
import PermissionService from "../services/permission.service";
import { ResponsesHelper } from "../helpers/responses";
import { paginationCheck } from "../helpers/dtos/pagination-request.dto";
import { UpdatePermissionDto } from "../dtos/permission/updatePermission.dto";

export default class PermissionController {
  permissionService: PermissionService;
  responseHelper: ResponsesHelper;
  constructor() {
    this.permissionService = new PermissionService();
    this.responseHelper = new ResponsesHelper();
  }

  createPermission = async (req: Request, res: Response) => {
    const permissionData: CreatePermissionDto = req.body;

    const response = await this.permissionService.createPermission(permissionData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  getAllPermission = async (req: Request, res: Response) => {
    // @ts-ignore
    const paginationData: PaginationRequestDto = paginationCheck(req.query);

    const response = await this.permissionService.getPermissions(
      paginationData
    );

    this.responseHelper.buildPaginatedControllerResponse(
      response,
      paginationData,
      res
    );
  };

  getPermission = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await this.permissionService.getPermission(+id);

    this.responseHelper.buildControllerResponse(response, res);
  };

  editPermission = async (req: Request, res: Response) => {
    const { id } = req.params;

    const permissionData: UpdatePermissionDto = req.body;

    const response = await this.permissionService.editPermission(+id, permissionData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  deletePermission = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await this.permissionService.deletePermission(+id);

    this.responseHelper.buildControllerResponse(response, res);
  };
}
