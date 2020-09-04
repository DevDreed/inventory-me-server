import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";

function validatUUIDMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
  if (!uuidV4Regex.test(req.params.id)) {
    const message: string = "Invalid lookup id";
    next(new HttpException(400, message));
  }
  next();
}

export default validatUUIDMiddleware;
