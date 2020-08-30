import { ApiProperty } from "@nestjs/swagger";

export enum Score {
  Admin = "admin",
  SuperAdmin = "superAdmin",
  User = "user",
}
export class CreateUserDto {
  @ApiProperty({
    minimum: 6,
    maximum: 16,
  })
  username: string;
  @ApiProperty({
    minimum: 6,
    maximum: 16,
  })
  password: string;
  @ApiProperty({
    enum: Score,
  })
  score: Score;
}
