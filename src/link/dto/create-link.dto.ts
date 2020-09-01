import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "apple",
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "http://www.apple.com",
  })
  src: string;
}
