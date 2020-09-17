import UploadController from "../controllers/upload.controller";
import { Router } from "express";
import Route from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";

class UploadRoute implements Route {
  public router = Router();
  public uploadController = new UploadController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/upload/:id`,
      authMiddleware,
      this.uploadController.uploadFile
    );
  }
}

export default UploadRoute;
