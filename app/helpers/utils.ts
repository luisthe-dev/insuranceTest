import * as jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export class UtilsHelper {
  JWT_SECRET: jwt.Secret;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";
  }

  generateRandInt(length: number = 6) {
    let start = "";
    let end = "";

    for (let i = 0; i < length; i++) {
      start = start + "" + 0;
      end = end + "" + 9;
    }

    return Math.floor(
      Math.random() * (Number(end) - Number(start)) * Number(start)
    );
  }

  generateToken(payload: User) {
    // @ts-ignore
    delete payload.password, payload.deletedAt;
    return jwt.sign(JSON.stringify(payload), this.JWT_SECRET);
  }
  
  verifyToken(token:string) {
    return jwt.verify(token, this.JWT_SECRET);
  }
}
