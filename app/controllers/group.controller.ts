import { Request, Response } from "express";
import { CreateGroupDto } from "../dtos/group/createGroup.dto";
import GroupService from "../services/group.service";
import { ResponsesHelper } from "../helpers/responses";
import { UpdateGroupDto } from "../dtos/group/updateGroup.dto";
import { paginationCheck } from "../helpers/dtos/pagination-request.dto";
import { UpdateGroupPermissionDto } from "../dtos/group/updateGroupPermission.dto";

export default class GroupController {
  groupService: GroupService;
  responseHelper: ResponsesHelper;

  constructor() {
    this.groupService = new GroupService();
    this.responseHelper = new ResponsesHelper();
  }

  createGroup = async (req: Request, res: Response) => {
    const groupData: CreateGroupDto = req.body;

    const response = await this.groupService.createGroup(groupData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  getGroups = async (req: Request, res: Response) => {
    // @ts-ignore
    const paginationData: PaginationRequestDto = paginationCheck(req.query);

    const response = await this.groupService.getGroups(paginationData);

    this.responseHelper.buildPaginatedControllerResponse(
      response,
      paginationData,
      res
    );
  };

  getGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await this.groupService.getGroup(+id);

    this.responseHelper.buildControllerResponse(response, res);
  };

  editGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    const groupData: UpdateGroupDto = req.body;

    const response = await this.groupService.editGroup(+id, groupData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  deleteGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await this.groupService.deleteGroup(+id);

    this.responseHelper.buildControllerResponse(response, res);
  };

  editGroupPermission = async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateData: UpdateGroupPermissionDto = req.body;

    const response = await this.groupService.editGroupPermission(
      +id,
      updateData
    );

    this.responseHelper.buildControllerResponse(response, res);
  };

  deleteGroupPermission = async (req: Request, res: Response) => {
    const { id, permissionId } = req.params;

    const response = await this.groupService.deleteGroupPermission(
      +id,
      +permissionId
    );

    this.responseHelper.buildControllerResponse(response, res);
  };
}
