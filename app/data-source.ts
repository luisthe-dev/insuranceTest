import dotenv from "dotenv";
import { DataSource } from "typeorm"
import { User } from "./models/user.model"
import { Role } from "./models/role.model";
import { Group } from "./models/group.model";
import { Permission } from "./models/permission.model";
import { GroupPermission } from "./models/groupPermission.model";
import { RolePermission } from "./models/rolePermission.model";
import { UserPermission } from "./models/userPermission.model";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Role, Group, Permission, GroupPermission, RolePermission, UserPermission],
  migrations: [],
  subscribers: [],
});
