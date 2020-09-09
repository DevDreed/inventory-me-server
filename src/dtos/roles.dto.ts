import { IsString } from "class-validator";

export class CreateRoleDto {
  @IsString()
  public description: string;
}
