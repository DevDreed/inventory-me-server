import HttpException from "../exceptions/HttpException";
import { isEmptyObject } from "../utils/util";
import { db } from "../db";
import { FileArray } from "express-fileupload";
import { Product } from "interfaces/products.interface";
import { v4 as uuidv4 } from "uuid";

class UploadService {
  public async upload(id: string, files: FileArray): Promise<any> {
    if (id === "") throw new HttpException(400, "No product selected");
    if (isEmptyObject(files)) throw new HttpException(400, "No file uploaded");

    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);

    const findProduct: Product = result.rows[0];
    const { file } = files;
    const filePath: string = `../client/public/uploads/`;
    const newFileName = `${uuidv4()}.${file.name.split(".").pop()}`;
    file.mv(`${filePath}${newFileName}`, async (err) => {
      if (err) {
        throw new HttpException(500, err);
      }
    });
    try {
      const imageResult = await db.query(
        "INSERT INTO product_images (filename, url, product_id) VALUES ($1, $2, $3) RETURNING id, url, filename",
        [file.name, `/uploads/${newFileName}`, findProduct.id]
      );
    } catch (err) {
      throw new HttpException(500, err);
    }
    return { fileName: file.name, filePath: newFileName };
  }
}

export default UploadService;
