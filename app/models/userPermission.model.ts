import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.model";
import { Permission } from "./permission.model";
import { Group } from "./group.model";
import { Role } from "./role.model";

@Entity()
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinTable()
  user: User;

  @ManyToOne(() => Permission)
  @JoinTable()
  permission: Permission;

  @ManyToOne(() => Group)
  @JoinTable()
  group: Group;

  @ManyToOne(() => Role)
  @JoinTable()
  role: Role;

  @Column({ type: "numeric" })
  permissionLevel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
