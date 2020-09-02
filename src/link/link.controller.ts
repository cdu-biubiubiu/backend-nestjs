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
import { LinkService } from "./link.service";
import { CreateLinkDto } from "./dto/create-link.dto";
import { ModifyLinkDto } from "./dto/modify-link.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../user/auth/jwt-auth.guard";
import { RolesGuard } from "../roles.guard";
import { Roles } from "../roles.decorator";
import { Role } from "../user/dto/create-user.dto";

@ApiTags("link")
@Controller("link")
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: "获取所有友情链接" })
  @ApiOkResponse({
    description: "获取成功",
    schema: {
      example: [
        {
          _id: "5f4f627c56e09e507efb92a6",
          name: "Baidu",
          src: "www.baidu.com",
        },
        {
          _id: "5f4f627c56e09e507efb92a7",
          name: "Tencent",
          src: "www.qq.com",
        },
        {
          _id: "5f4f627c56e09e507efb92a8",
          name: "Zhihu",
          src: "www.zhihu.com",
        },
        {
          _id: "5f4f627c56e09e507efb92a9",
          name: "netflix",
          src: "www.netflix.com",
        },
      ],
    },
  })
  async findAll() {
    return this.linkService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: "没有权限",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiOperation({ summary: "新建一个友情链接" })
  @ApiCreatedResponse({
    description: "新建成功",
    schema: {
      example: {
        _id: "5f4df1761ff10bc39e3c1ad4",
        name: "Baidu",
        src: "www.baidu.com",
      },
    },
  })
  async createOne(@Body() createLinkDto: CreateLinkDto) {
    return this.linkService.createOne(createLinkDto);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
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
        message: "修改失败,请检查你的id是否有错",
        error: "Bad Request",
      },
    },
  })
  @ApiOperation({ summary: "修改一个友情链接" })
  @ApiOkResponse({
    description: "修改成功",
    schema: {
      example: {
        _id: "5f4df1761ff10bc39e3c1ad4",
        name: "Baidu",
        src: "www.baidu.com",
      },
    },
  })
  async modifyOne(@Param("id") id: string, @Body() modifyLinkDto: ModifyLinkDto) {
    return this.linkService.modifyOne(id, modifyLinkDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
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
        message: "删除失败,请检查你的id是否有错",
        error: "Bad Request",
      },
    },
  })
  @ApiOkResponse({ description: "删除成功" })
  @ApiOperation({ summary: "删除一个友情链接" })
  async deleteOne(@Param("id") id: string) {
    return this.linkService.deleteOne(id);
  }
}
