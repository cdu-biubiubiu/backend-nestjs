import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEnum, IsString } from "class-validator";

export enum Score {
  Admin = "admin",
  SuperAdmin = "superAdmin",
  User = "user",
}
export class CreateUserDto {
  @IsString()
  @ApiProperty({
    minimum: 6,
    maximum: 16,
  })
  username: string;
  @IsString()
  @IsAlphanumeric()
  @ApiProperty({
    minimum: 6,
    maximum: 16,
  })
  password: string;
  @IsEnum(Score)
  @ApiProperty({
    enum: Score,
  })
  score: Score;
}
