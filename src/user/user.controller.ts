import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { UserService } from "./user.service";
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @ApiCreatedResponse({ description: "The resource has been successfully created." })
  @ApiForbiddenResponse({ description: "Forbidden" })
  async createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }

  @Put(":id")
  @ApiForbiddenResponse({ description: "Forbidden" })
  async modifyOne(@Param("id") id: string, @Body() modifyUserDto: ModifyUserDto) {
    return this.userService.modifyOne(id, modifyUserDto);
  }

  @Delete(":id")
  @ApiForbiddenResponse({ description: "Forbidden" })
  async deleteOne(@Param("id") id: string) {
    return this.userService.deleteOne(id);
  }
}
