import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService, private authService: AuthService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }
  @Post("login")
  @UseGuards(LocalAuthGuard)
  // @ApiBasicAuth()
  async login(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.login(verifyUserDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async modifyOne(@Param("id") id: string, @Body() modifyUserDto: ModifyUserDto) {
    return this.userService.modifyOne(id, modifyUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async deleteOne(@Param("id") id: string) {
    return this.userService.deleteOne(id);
  }
}
