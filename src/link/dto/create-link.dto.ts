import { ApiProperty } from "@nestjs/swagger";

export class CreateLinkDto {
  @ApiProperty({
    default: "Apple",
  })
  name: string;
  @ApiProperty({
    default: "https://www.apple.com",
  })
  src: string;
}
