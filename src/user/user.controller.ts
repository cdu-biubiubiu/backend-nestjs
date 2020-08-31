import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { UserService } from "./user.service";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { VerifyUserDto } from "./dto/verify-user.dto";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @ApiCreatedResponse({ description: "The resource has been successfully created.", type: CreateUserDto })
  async createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }

  @Put(":id")
  async modifyOne(@Param("id") id: string, @Body() modifyUserDto: ModifyUserDto) {
    return this.userService.modifyOne(id, modifyUserDto);
  }

  @Delete(":id")
  async deleteOne(@Param("id") id: string) {
    return this.userService.deleteOne(id);
  }

  @Post("verify")
  async verifyOne(@Body() verifyUserDto: VerifyUserDto) {
    return this.userService.verify(verifyUserDto);
  }
}
