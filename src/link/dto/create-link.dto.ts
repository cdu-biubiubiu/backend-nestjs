import { ApiProperty } from "@nestjs/swagger";
import { IsFQDN, IsNotEmpty, IsString } from "class-validator";

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "apple",
  })
  name: string;
  @IsFQDN()
  @IsNotEmpty()
  @ApiProperty({
    example: "http://www.apple.com",
  })
  src: string;
}
