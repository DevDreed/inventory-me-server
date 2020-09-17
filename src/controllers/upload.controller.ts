import { NextFunction, Request, Response } from "express";
import UploadService from "../services/upload.service";
import { Product } from "../interfaces/products.interface";

class UploadController {
  public uploadService = new UploadService();

  public uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllProductsData: any = await this.uploadService.upload(
        req.params.id,
        req.files
      );
      res.status(200).json({ data: findAllProductsData, message: "findAll" });
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  };
}

export default UploadController;
