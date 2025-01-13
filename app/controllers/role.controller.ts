import { Request, Response } from "express";
import RoleService from "../services/role.service";
import { ResponsesHelper } from "../helpers/responses";
import { CreateRoleDto } from "../dtos/role/createRole.dto";
import { paginationCheck } from "../helpers/dtos/pagination-request.dto";
import { UpdateRoleDto } from "../dtos/role/updateRole.dto";

export default class RoleController {
  roleService: RoleService;
  responseHelper: ResponsesHelper;

  constructor() {
    this.roleService = new RoleService();
    this.responseHelper = new ResponsesHelper();
  }

  createRole = async (req: Request, res: Response) => {
    const roleData: CreateRoleDto = req.body;

    const response = await this.roleService.createRole(roleData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  getRoles = async (req: Request, res: Response) => {
    // @ts-ignore
    const paginationData: PaginationRequestDto = paginationCheck(req.query);

    const response = await this.roleService.getRoles(paginationData);

    this.responseHelper.buildPaginatedControllerResponse(
      response,
      paginationData,
      res
    );
  };

  getRole = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await this.roleService.getRole(+id);

    this.responseHelper.buildControllerResponse(response, res);
  };

  editRole = async (req: Request, res: Response) => {
    const { id } = req.params;

    const roleData: UpdateRoleDto = req.body;

    const response = await this.roleService.editRole(+id, roleData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  deleteRole = async(req: Request, res: Response) => {
    const { id } = req.params;

    const response = await this.roleService.deleteRole(+id);

    this.responseHelper.buildControllerResponse(response, res);
  };

  editRolePermission = (req: Request, res: Response) => {};

  deleteRolePermission = (req: Request, res: Response) => {};
}
