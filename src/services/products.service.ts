import HttpException from "../exceptions/HttpException";
import { Product } from "../interfaces/products.interface";
import { isEmptyObject } from "../utils/util";
import { db } from "../db";
import { CreateProductDto } from "dtos/products.dto";

class ProductService {
  public async findAllProducts(): Promise<Product[]> {
    const products = await db.query(
      `SELECT p.id, p.description, p.price, p.quantity, p.percent_markup, p.backordered, p.created_date, p.updated_date,
      (
        SELECT json_agg(row_to_json(i)) FROM
        (
          SELECT url, filename FROM product_images WHERE product_id = p.id
        ) i
      ) AS images
      FROM products p;`
    );

    return products.rows;
  }

  public async findProductById(id: string): Promise<Product> {
    const product = await db.query(
      "SELECT id, description, price, quantity, percent_markup, backordered, created_date, updated_date FROM products WHERE id = $1",
      [id]
    );
    const findProduct: Product = product.rows[0];
    if (!findProduct) throw new HttpException(409, "You're not product");

    const images = await db.query(
      "SELECT url, filename FROM images INNER JOIN product_images ON images.id=product_images.image_id WHERE product_id = $1",
      [id]
    );
    findProduct.images = images.rows;
    return findProduct;
  }

  public async createProduct(productData: CreateProductDto): Promise<any> {
    if (isEmptyObject(productData))
      throw new HttpException(400, "Product is empty");

    let newProduct = await db.query(
      "INSERT INTO products (description, size, price, percent_markup, quantity, backordered) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, description, price, quantity, percent_markup, backordered, created_date, updated_date",
      [
        productData.description,
        productData.size,
        productData.price,
        productData.percent_markup,
        productData.quantity,
        productData.backordered,
      ]
    );
    const result = newProduct.rows[0];
    const images = await db.query(
      "SELECT url, filename FROM product_images WHERE product_id = $1",
      [result.id]
    );
    result.images = images.rows;

    return result;
  }

  public async updateProduct(
    id: string,
    productData: Product
  ): Promise<Product> {
    if (isEmptyObject(productData))
      throw new HttpException(400, "You're not productData");

    const product = await db.query("SELECT * FROM products WHERE id  = $1", [
      id,
    ]);
    const findProduct: any = product.rows[0];
    if (!findProduct)
      throw new HttpException(409, `You're product ${id} doesn't exists`);

    const updatedProduct = await db.query(
      "UPDATE products SET description = $2, size = $3, price = $4, percent_markup = $5, quantity = $6, backordered = $7, updated_date = NOW() WHERE id = $1 RETURNING id, description, price, quantity, percent_markup, backordered, created_date, updated_date",
      [
        id,
        productData.description,
        productData.size,
        productData.price,
        productData.percent_markup,
        productData.quantity,
        productData.backordered,
      ]
    );

    return updatedProduct.rows[0];
  }

  public async deleteProduct(id: string): Promise<string> {
    const product = await db.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    const findProduct: Product = product.rows[0];
    if (!findProduct) throw new HttpException(409, "You're not product");

    const deletedImageData: Product[] = await db.query(
      "DELETE FROM product_images WHERE product_id = $1",
      [id]
    );

    const deletedProductData: Product[] = await db.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );
    return "deleteProductData";
  }
}

export default ProductService;
