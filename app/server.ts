import "reflect-metadata";
import express, { Express } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";
import roleRouter from "./routes/role.route";
import groupRouter from "./routes/group.route";
import permissionRouter from "./routes/permission.route";
import { AppDataSource } from "./data-source";
import { PermissionMiddleware } from "./middlewares/permission.middleware";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

const permissionMiddleware: PermissionMiddleware = new PermissionMiddleware();

app.use(permissionMiddleware.handleAuth)

AppDataSource.initialize()
  .then(async () => {
    app.use("/user", userRouter);
    app.use("/role", roleRouter);
    app.use("/group", groupRouter);
    app.use("/permission", permissionRouter);

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
