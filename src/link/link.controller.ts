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
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../user/jwt-auth.guard";

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async createOne(@Body() createLinkDto: CreateLinkDto) {
    return this.linkService.createOne(createLinkDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async modifyOne(@Param("id") id: string, @Body() modifyLinkDto: ModifyLinkDto) {
    return this.linkService.modifyOne(id, modifyLinkDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async deleteOne(@Param("id") id: string) {
    return this.linkService.deleteOne(id);
  }
}
