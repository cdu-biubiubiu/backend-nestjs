import { ApiProperty } from "@nestjs/swagger";

export enum Score {
  Admin = "admin",
  SuperAdmin = "superAdmin",
  User = "user",
}
export class CreateUserDto {
  @ApiProperty({
    required: true,
    minimum: 6,
    maximum: 16,
  })
  username: string;
  @ApiProperty({
    minimum: 6,
    maximum: 16,

    required: true,
  })
  password: string;
  @ApiProperty({
    enum: Score,
  })
  score: Score;
}
