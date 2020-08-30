import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { ApiTags } from "@nestjs/swagger";
import { ModifyPostDto } from "./dto/modify-post.dto";

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
  async createOne(@Body() createPostDto: CreatePostDto) {
    return this.postService.createOne(createPostDto);
  }

  @Put(":id")
  async modifyOne(@Param("id") id: string, @Body() modifyPostDto: ModifyPostDto) {
    return this.postService.modifyOne(id, modifyPostDto);
  }

  @Delete(":id")
  async deleteOne(@Param("id") id: string) {
    return this.postService.deleteOne(id);
  }
}
