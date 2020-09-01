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
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
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
  async findAll() {
    return this.linkService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async createOne(@Body() createLinkDto: CreateLinkDto) {
    return this.linkService.createOne(createLinkDto);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  @ApiBadRequestResponse({ description: "修改失败,请检查你的id是否有错" })
  async modifyOne(@Param("id") id: string, @Body() modifyLinkDto: ModifyLinkDto) {
    return this.linkService.modifyOne(id, modifyLinkDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  @ApiBadRequestResponse({ description: "删除失败,请检查你的id是否有错" })
  async deleteOne(@Param("id") id: string) {
    return this.linkService.deleteOne(id);
  }
}
