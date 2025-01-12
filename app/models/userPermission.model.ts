import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;
  userId: number;
  permissionId: number;
  groupId: number;
  roleId: number;

    @Column({ type: "numeric" })
  permissionLevel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}