import { NextFunction, Request, Response } from "express";
import { HTTPMethodMap } from "../dtos/permission/permissionMiddleware.dto";
import { Repository } from "typeorm";
import { Permission } from "../models/permission.model";
import { AppDataSource } from "../data-source";
import { ResponsesHelper, ServiceCodeMap } from "../helpers/responses";

export class PermissionMiddleware {
    permissionRepository: Repository<Permission>;
    responseHelper: ResponsesHelper;

    constructor () {
        this.permissionRepository = new Repository(Permission, AppDataSource.manager);
        this.responseHelper = new ResponsesHelper();
    }

    handleAuth = async (req: Request, res: Response, next: NextFunction) => {
        const requestUrl = req.url;
        //@ts-ignore
        const requestMethod = HTTPMethodMap[req.method];
        
        const requestModel = requestUrl.split("?")[0].split("/")[1];

        const permissions = await this.permissionRepository.findOneBy({"permissionModel": requestModel});

        if(!permissions) {
            this.responseHelper.buildControllerResponse({
              status: "failed",
              message: "Permissions Invalid",
              code: ServiceCodeMap.UNAUTHORIZED
            }, res);

            return;
        }

        next();
    }

}