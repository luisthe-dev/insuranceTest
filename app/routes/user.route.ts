import express, { Express } from "express";
import UserController from "../controllers/user.controller";
import UserPermissionController from "../controllers/userPermission.controller";

const userRouter: Express = express();

const userController: UserController = new UserController();
const userPermissionController: UserPermissionController = new UserPermissionController();

userRouter.post("/login", userController.userLogin);
userRouter.get("/", userController.getSelf);
userRouter.patch("/", userController.updateUser);

userRouter.get("/search", userController.getUsers);
userRouter.post("/create", userController.userCreate);

userRouter.get("/:id", userController.getUser);
userRouter.patch("/:id", userController.editUser);
userRouter.delete("/:id", userController.deleteUser);

userRouter.patch("/:id/permission", userPermissionController.updateUserPermission);
userRouter.patch("/:id/role", userPermissionController.updateUserRole);
userRouter.patch("/:id/group", userPermissionController.updateUserGroup);

export default userRouter;
