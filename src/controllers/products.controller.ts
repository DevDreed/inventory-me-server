import { NextFunction, Request, Response } from "express";
import { Product } from "../interfaces/products.interface";
import productService from "../services/products.service";

class ProductsController {
  public productService = new productService();

  public getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllProductsData: Product[] = await this.productService.findAllProducts();
      res.status(200).json({ data: findAllProductsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id: string = req.params.id;
    try {
      const findOneUserData: Product = await this.productService.findProductById(
        id
      );
      res.status(200).json({ data: findOneUserData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const productData: Product = req.body;

    try {
      const updateProductData: Product = await this.productService.createProduct(
        productData
      );
      res.status(200).json({ data: updateProductData, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id: string = req.params.id;
    const productData: Product = req.body;

    try {
      const updateProductData: Product = await this.productService.updateProduct(
        id,
        productData
      );
      res.status(200).json({ data: updateProductData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id: string = req.params.id;

    try {
      const delectProductData: string = await this.productService.deleteProduct(
        id
      );
      res.status(200).json({ data: delectProductData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
