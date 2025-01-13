//create, edit, update, delete group
import express, { Express } from "express";
import GroupController from "../controllers/group.controller";

const groupRouter: Express = express();

const groupController: GroupController = new GroupController();

groupRouter.post("/", groupController.createGroup);

groupRouter.get("/:id", groupController.getGroup);
groupRouter.patch("/:id", groupController.editGroup);
groupRouter.delete("/:id", groupController.deleteGroup);

groupRouter.patch("/:id/permissions", groupController.editGroupPermission);
groupRouter.delete("/:id/permissions", groupController.deleteGroupPermission);

export default groupRouter;
