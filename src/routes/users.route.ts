import { Router } from "express";
import UsersController from "../controllers/users.controller";
import { CreateUserDto } from "../dtos/users.dto";
import Route from "../interfaces/routes.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import validatUUIDMiddleware from "../middlewares/validateUUID.middleware";

class UsersRoute implements Route {
  public path = "/users";
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.usersController.getUsers
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      validatUUIDMiddleware,
      this.usersController.getUserById
    );
    this.router.put(
      `${this.path}/:id`,
      validatUUIDMiddleware,
      authMiddleware,
      validationMiddleware(CreateUserDto, true),
      this.usersController.updateUser
    );
    this.router.delete(
      `${this.path}/:id`,
      validatUUIDMiddleware,
      authMiddleware,
      this.usersController.deleteUser
    );
  }
}

export default UsersRoute;
