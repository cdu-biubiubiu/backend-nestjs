import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  @ApiProperty({
    example: "我是标题",
  })
  @IsNotEmpty()
  title: string;
  @IsString()
  @ApiProperty({
    example: "我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容",
  })
  content: string;
}
