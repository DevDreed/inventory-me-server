import { IsEmail, IsString, IsNumber, IsBoolean } from "class-validator";

export class CreateProductDto {
  @IsString()
  public description: string;

  @IsString()
  public size: string;

  @IsNumber()
  public quantity: number;

  @IsNumber()
  public percent_markup: number;

  @IsNumber()
  public price: number;

  @IsBoolean()
  public backordered: boolean;
}


