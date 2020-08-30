import { ApiProperty } from "@nestjs/swagger";

export class ModifyPostDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
}
