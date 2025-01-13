import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserStatus {
  VERIFIED = "verified",
  BLOCKED = "blocked",
}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  fullName: string;

  @Column({ type: "varchar", unique: true })
  userName: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.VERIFIED,
  })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  buildResponseUser = () => {
    return {
      id: this.id,
      fullName: this.fullName,
      userName: this.userName,
      email: this.email,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
