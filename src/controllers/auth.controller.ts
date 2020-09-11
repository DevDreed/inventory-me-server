import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginUserDto } from "../dtos/users.dto";
import { RequestWithUser } from "../interfaces/auth.interface";
import { User } from "../interfaces/users.interface";
import AuthService from "../services/auth.service";
import { dir } from "console";

class AuthController {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    try {
      const registerUserData: User = await this.authService.register(userData);
      res.status(201).json({ data: registerUserData, message: "register" });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: LoginUserDto = req.body;

    try {
      const { token, findUser } = await this.authService.login(userData);
      res.status(200).json({ token, data: findUser, message: "login" });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const userData: User = req.user;

    try {
      res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
      res.status(200).json({ message: "logout" });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
