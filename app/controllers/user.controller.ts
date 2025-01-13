import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/user/createUser.dto";
import UserService from "../services/user.service";
import { ResponsesHelper } from "../helpers/responses";
import { LoginUserDto } from "../dtos/user/loginUser.dto";
import {
  paginationCheck,
  PaginationRequestDto,
} from "../helpers/dtos/pagination-request.dto";
import { UpdateUserDto } from "../dtos/user/updateUser.dto";

export default class UserController {
  userService: UserService;
  responseHelper: ResponsesHelper;

  constructor() {
    this.userService = new UserService();
    this.responseHelper = new ResponsesHelper();
  }

  userLogin = async (req: Request, res: Response) => {
    const userData: LoginUserDto = req.body;

    const response = await this.userService.loginUser(userData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  userCreate = async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;

    const response = await this.userService.createUser(userData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  getSelf = async (req: Request, res: Response) => {
    const headers = req.headers;

    const token = headers.authorization ?? "";

    const response = await this.userService.getSelf(token);

    this.responseHelper.buildControllerResponse(response, res);
  };

  getUsers = async (req: Request, res: Response) => {
    // @ts-ignore
    const paginationData: PaginationRequestDto = paginationCheck(req.query);

    const response = await this.userService.getUsers(paginationData);

    this.responseHelper.buildPaginatedControllerResponse(
      response,
      paginationData,
      res
    );
  };

  getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await this.userService.getUser(+id);

    this.responseHelper.buildControllerResponse(response, res);
  };

  updateUser = async (req: Request, res: Response) => {
    const headers = req.headers;

    const token = headers.authorization ?? "";
    const userData: UpdateUserDto = req.body;

    const response = await this.userService.updateUser(token, userData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  editUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const userData: UpdateUserDto = req.body;

    const response = await this.userService.editUser(+id, userData);

    this.responseHelper.buildControllerResponse(response, res);
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const userData: UpdateUserDto = req.body;

    const response = await this.userService.deleteUser(+id);

    this.responseHelper.buildControllerResponse(response, res);};
}
