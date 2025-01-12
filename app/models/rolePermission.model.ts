import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;
  roleId: number;
  permissionId: number;
  
  @Column({type: "numeric"})
  permissionLevel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}