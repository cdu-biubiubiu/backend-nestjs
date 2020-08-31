import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLinkDto {
  @IsString()
  @ApiProperty({
    example: "apple",
  })
  name: string;
  @IsString()
  @ApiProperty({
    example: "http://www.apple.com",
  })
  src: string;
}
