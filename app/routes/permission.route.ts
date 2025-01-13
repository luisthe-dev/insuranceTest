//create, edit, update, delete permissions
import express, { Express } from "express";
import PermissionController from "../controllers/permission.controller";

const permissionRouter: Express = express();

const permissionController: PermissionController = new PermissionController();

permissionRouter.post("/", permissionController.createPermission);

permissionRouter.get("/:id", permissionController.getPermission);
permissionRouter.patch("/:id", permissionController.editPermission);
permissionRouter.delete("/:id", permissionController.deletePermission);

export default permissionRouter;
