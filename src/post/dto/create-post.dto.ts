import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow, IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
  @ApiProperty({
    example: "我是标题",
  })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    example: "我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
  @ApiHideProperty()
  creationDate: Date;
  @ApiHideProperty()
  modifiedDate: Date;
}
