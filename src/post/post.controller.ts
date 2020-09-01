import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ModifyPostDto } from "./dto/modify-post.dto";
import { JwtAuthGuard } from "../user/auth/jwt-auth.guard";
import { RolesGuard } from "../roles.guard";
import { Role } from "../user/dto/create-user.dto";
import { Roles } from "../roles.decorator";

@ApiTags("post")
@Controller("post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll() {
    return this.postService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.postService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async createOne(@Body() createPostDto: CreatePostDto) {
    return this.postService.createOne(createPostDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  @ApiBadRequestResponse({ description: "修改失败,请检查你的id是否有错" })
  async modifyOne(@Param("id") id: string, @Body() modifyPostDto: ModifyPostDto) {
    return this.postService.modifyOne(id, modifyPostDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  @ApiBadRequestResponse({ description: "删除失败,请检查你的id是否有错" })
  async deleteOne(@Param("id") id: string) {
    return this.postService.deleteOne(id);
  }
}
