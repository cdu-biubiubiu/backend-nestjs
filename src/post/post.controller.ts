import {
  BadRequestException,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ModifyPostDto } from "./dto/modify-post.dto";
import { JwtAuthGuard } from "../user/auth/jwt-auth.guard";
import { RolesGuard } from "../roles.guard";
import { Role } from "../user/dto/create-user.dto";
import { Roles } from "../roles.decorator";
import { create } from "domain";

@ApiTags("post")
@Controller("post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: "获取所有文章", deprecated: true })
  @ApiOkResponse({ description: "获取成功" })
  async findAll() {
    return this.postService.findAll();
  }
  @Get("r/:range/:index")
  @ApiOperation({ summary: "获取{range}条文章,index为{index}" })
  @ApiOkResponse({ description: "获取成功" })
  async findWithRangeAndIndex() {
    //TODO
  }

  @Get(":id")
  @ApiOperation({ summary: "获取一篇文章" })
  @ApiOkResponse({ description: "获取成功" })
  // TODO: add response
  @ApiBadRequestResponse({ description: "请求失败" })
  async findOne(@Param("id") id: string) {
    return this.postService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: "没有权限!",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiCreatedResponse({ description: "创建成功" })
  @ApiOperation({ summary: "创建一篇文章" })
  async createOne(@Body() createPostDto: CreatePostDto) {
    return this.postService.createOne(createPostDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiUnauthorizedResponse({
    description: "没有权限",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "修改失败",
    schema: {
      example: {
        statusCode: 400,
        message: "你的id有误",
        error: "Bad Request",
      },
    },
  })
  @ApiOkResponse({ description: "修改成功" })
  @ApiOperation({ summary: "修改一篇文章" })
  async modifyOne(@Param("id") id: string, @Body() modifyPostDto: ModifyPostDto) {
    return this.postService.modifyOne(id, modifyPostDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiUnauthorizedResponse({
    description: "没有权限",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "删除失败",
    schema: {
      example: {
        statusCode: 400,
        message: "你的id有误",
        error: "Bad Request",
      },
    },
  })
  @ApiOkResponse({ description: "删除成功" })
  @ApiOperation({ summary: "删除一篇文章" })
  async deleteOne(@Param("id") id: string) {
    return this.postService.deleteOne(id);
  }
}
