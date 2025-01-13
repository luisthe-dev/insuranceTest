import express, { Express } from "express";
import RoleController from "../controllers/role.controller";

const roleRouter: Express = express();

const roleController: RoleController = new RoleController();

roleRouter.post("/", roleController.createRole);
roleRouter.get("/", roleController.getRoles);

roleRouter.get("/:id", roleController.getRole);
roleRouter.patch("/:id", roleController.editRole);
roleRouter.delete("/:id", roleController.deleteRole);

roleRouter.patch("/:id/permissions", roleController.editRolePermission);
roleRouter.delete("/:id/permissions", roleController.deleteRolePermission);

export default roleRouter;
