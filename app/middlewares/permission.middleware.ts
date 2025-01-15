import { NextFunction, Request, Response } from "express";
import { HTTPMethodMap } from "../dtos/permission/permissionMiddleware.dto";
import { Repository } from "typeorm";
import { Permission } from "../models/permission.model";
import { AppDataSource } from "../data-source";
import { ResponsesHelper, ServiceCodeMap } from "../helpers/responses";
import UserService from "../services/user.service";
import { User } from "../models/user.model";
import { UserPermission } from "../models/userPermission.model";
import { Role } from "../models/role.model";
import { Group } from "../models/group.model";
import { RolePermission } from "../models/rolePermission.model";
import { GroupPermission } from "../models/groupPermission.model";

export class PermissionMiddleware {
  permissionRepository: Repository<Permission>;
  responseHelper: ResponsesHelper;
  userService: UserService;
  userPermissionRepository: Repository<UserPermission>;
  rolePermissionRepository: Repository<RolePermission>;
  groupPermissionRepository: Repository<GroupPermission>;

  UrlruleExemptions = ["/user/login", "/user"];

  constructor() {
    this.permissionRepository = new Repository(
      Permission,
      AppDataSource.manager
    );
    this.userPermissionRepository = new Repository(
      UserPermission,
      AppDataSource.manager
    );
    this.rolePermissionRepository = new Repository(
      RolePermission,
      AppDataSource.manager
    );
    this.groupPermissionRepository = new Repository(
      GroupPermission,
      AppDataSource.manager
    );
    this.userService = new UserService();
    this.responseHelper = new ResponsesHelper();
  }

  handleAuth = async (req: Request, res: Response, next: NextFunction) => {
    let rolePermission: RolePermission | null = null;
    let groupPermission: GroupPermission | null = null;

    const requestUrl = req.url;

    if (this.UrlruleExemptions.includes(requestUrl.split("?")[0])) {
      next();
      return;
    }

    const headers = req.headers;

    const token = headers.authorization ?? "";
    //@ts-ignore
    const requestPermissionLevel: number = HTTPMethodMap[req.method];

    const requestModel = requestUrl.split("?")[0].split("/")[1];

    const permission: Permission | null =
      await this.permissionRepository.findOneBy({
        permissionModel: requestModel,
      });

    if (!permission || !token) return this.invalidExit(res);

    const response = await this.userService.getSelf(token);

    if (response.status == "failed") return this.invalidExit(res);

    const currentUser: User = response.data;

    const userPermission: UserPermission | null =
      await this.userPermissionRepository.findOne({
        where: {
          permission: { id: permission.id },
          user: { id: currentUser.id },
        },
        relations: ["role", "group"],
      });
    if (!userPermission) return this.invalidExit(res);

    const role: Role = userPermission.role;
    const group: Group = userPermission.group;

    if (role) {
      rolePermission = await this.rolePermissionRepository.findOne({
        where: {
          role: { id: role.id },
          permission: { id: permission.id },
        },
      });
    }

    if (group) {
      groupPermission = await this.groupPermissionRepository.findOne({
        where: {
          group: { id: group.id },
          permission: { id: permission.id },
        },
      });
    }

    const userPermissionLevel: number = userPermission.permissionLevel ?? 0;
    const rolePermissionLevel: number = rolePermission?.permissionLevel ?? 0;
    const groupPermissionLevel: number = groupPermission?.permissionLevel ?? 0;

    const highestPermissionLevel = Math.max(
      userPermissionLevel,
      rolePermissionLevel,
      groupPermissionLevel
    );

    if (requestPermissionLevel > highestPermissionLevel)
      return this.invalidExit(res);

    next();
  };

  invalidExit = (res: Response) => {
    this.responseHelper.buildControllerResponse(
      {
        status: "failed",
        message: "Permissions Invalid",
        code: ServiceCodeMap.UNAUTHORIZED,
      },
      res
    );

    return;
  };
}
