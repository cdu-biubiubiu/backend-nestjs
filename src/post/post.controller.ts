import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { ApiForbiddenResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("post")
@Controller("post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async findAll() {
    return this.postService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.postService.findOne(id);
  }

  @Post()
  @ApiForbiddenResponse({ description: "Forbidden" })
  async createOne(@Body() createPostDto: CreatePostDto) {
    return this.postService.createOne(createPostDto);
  }

  @Put(":id")
  @ApiForbiddenResponse({ description: "Forbidden" })
  async modifyOne(@Param("id") id: string, @Body() modifyPostDto) {
    return this.postService.modifyOne(id, modifyPostDto);
  }

  @Delete(":id")
  @ApiForbiddenResponse({ description: "Forbidden" })
  async deleteOne(@Param("id") id: string) {
    return this.postService.deleteOne(id);
  }
}
