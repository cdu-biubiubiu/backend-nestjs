import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreatePostDto } from "./create-post.dto";

export class ModifyPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    example: "我是修改后的title",
  })
  title: string;
  @ApiProperty({
    example: "我是修改后的content",
  })
  content: string;
}
