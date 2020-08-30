import { ApiProperty } from "@nestjs/swagger";

export class CreateLinkDto {
  @ApiProperty({
    default: "Apple",
    required: true,
  })
  name: string;
  @ApiProperty({
    required: true,
    default: "https://www.apple.com",
  })
  src: string;
}
