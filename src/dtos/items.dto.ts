import { IsString, IsNumber } from "class-validator";

export class CreateItemDto {
  @IsString()
  public description: string;

  @IsNumber()
  public price: number;

  @IsString()
  public item_type_id: string;
}

export class CreateItemTypeDto {
  @IsString()
  public description: string;
}
