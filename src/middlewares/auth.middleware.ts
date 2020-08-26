import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";
import {
  DataStoredInToken,
  RequestWithUser,
} from "../interfaces/auth.interface";
import { db } from "../db";
import { log, dir } from "console";

async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;

    try {
      dir(cookies);
      dir(secret);
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      dir(verificationResponse);
      const userId = verificationResponse.id;
      log(userId);
      dir(req.user);
      const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
        req.user.email,
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
