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

  @ManyToOne(() => Group, { nullable: true })
  @JoinTable()
  group: Group;

  @ManyToOne(() => Role, { nullable: true })
  @JoinTable()
  role: Role;

  @Column({ type: "numeric", nullable: true })
  permissionLevel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
