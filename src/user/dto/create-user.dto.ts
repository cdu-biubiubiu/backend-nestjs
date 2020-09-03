import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEnum, IsNotEmpty, Length } from "class-validator";
import { DefaultDeserializer } from "v8";
import { Transform } from "stream";

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
  @IsNotEmpty()
  role: Role;
}
