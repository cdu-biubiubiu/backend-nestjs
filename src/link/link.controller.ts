import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { LinkService } from "./link.service";
import { CreateLinkDto } from "./dto/create-link.dto";
import { ModifyLinkDto } from "./dto/modify-link.dto";

@Controller("link")
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Get()
  async findAll() {
    return this.linkService.findAll();
  }

  @Post()
  async createOne(@Body() createLinkDto: CreateLinkDto) {
    return this.linkService.createOne(createLinkDto);
  }

  @Put(":id")
  async modifyOne(@Param("id") id: string, @Body() modifyLinkDto: ModifyLinkDto) {
    return this.linkService.modifyOne(id, modifyLinkDto);
  }

  @Delete(":id")
  async deleteOne(@Param("id") id: string) {
    return this.linkService.deleteOne(id);
  }
}
