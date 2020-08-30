import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEnum, Length } from "class-validator";

export enum Score {
  Admin = "admin",
  SuperAdmin = "superAdmin",
  User = "user",
}
export class CreateUserDto {
  @IsAlphanumeric()
  @Length(6, 16)
  @ApiProperty({
    example: "defaultUser",
  })
  username: string;
  @IsAlphanumeric()
  @Length(6, 16)
  @ApiProperty({
    example: "defaultPassword",
  })
  password: string;
  @IsEnum(Score)
  score: Score = Score.User;
}
