import { Router } from "express";
import ProductsController from "../controllers/products.controller";
import { CreateProductDto } from "../dtos/products.dto";
import Route from "../interfaces/routes.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import validatUUIDMiddleware from "../middlewares/validateUUID.middleware";

class ProductsRoute implements Route {
  public path = "/products";
  public router = Router();
  public productsController = new ProductsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.productsController.getProducts
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      validatUUIDMiddleware,
      this.productsController.getProductById
    );
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateProductDto, true),
      this.productsController.createProduct
    );
    this.router.put(
      `${this.path}/:id`,
      validatUUIDMiddleware,
      authMiddleware,
      validationMiddleware(CreateProductDto, true),
      this.productsController.updateProduct
    );
    this.router.delete(
      `${this.path}/:id`,
      validatUUIDMiddleware,
      authMiddleware,
      this.productsController.deleteProduct
    );
  }
}

export default ProductsRoute;
