import express, { Express } from "express";
import UserController from "../controllers/user.controller";

const userRouter: Express = express();

const userController: UserController = new UserController();

userRouter.post("login", userController.userLogin);
userRouter.get("", userController.getSelf);
userRouter.patch("", userController.updateUser);

userRouter.post("create", userController.userCreate);

userRouter.get(":id", userController.getUser);
userRouter.patch(":id", userController.editUser);
userRouter.delete(":id", userController.deleteUser);

export default userRouter;
