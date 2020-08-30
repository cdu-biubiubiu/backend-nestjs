import { ApiProperty } from "@nestjs/swagger";

export class ModifyLinkDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  src: string;
}
