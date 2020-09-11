import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";
import {
  DataStoredInToken,
  RequestWithUser,
} from "../interfaces/auth.interface";
import { db } from "../db";
import { dir } from "console";

async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const headers = req.headers;
  console.log("headers", headers);
  if (headers && headers.authorization) {
    const secret = process.env.JWT_SECRET;

    try {
      const verificationResponse = jwt.verify(
        headers.authorization,
        secret
      ) as DataStoredInToken;
      const userId = verificationResponse.id;
      const user = await db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);
      const findUser: any = user.rows[0];

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong authentication token"));
      }
    } catch (error) {
      next(new HttpException(401, "Wrong authentication token"));
    }
  } else {
    next(new HttpException(404, "Authentication token missing"));
  }
}

export default authMiddleware;
