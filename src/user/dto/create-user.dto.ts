import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEnum, Length } from "class-validator";

export enum Role {
  Admin = "admin",
  SuperAdmin = "superAdmin",
  User = "user",
}
export class CreateUserDto {
  @IsAlphanumeric()
  @Length(6, 16)
  @ApiProperty({
    example: "hanhanhan",
  })
  username: string;
  @IsAlphanumeric()
  @Length(6, 16)
  @ApiProperty({
    example: "hanhanhan",
  })
  password: string;
  @IsEnum(Role)
  role: Role = Role.User;
}
