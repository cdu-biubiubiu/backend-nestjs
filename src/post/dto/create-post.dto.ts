import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow, IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  @ApiProperty({
    example: "我是标题",
  })
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容",
  })
  content: string;
  @ApiHideProperty()
  @Allow({ always: false })
  creationDate: Date;
  @ApiHideProperty()
  @Allow({ always: false })
  modifiedDate: Date;
}
