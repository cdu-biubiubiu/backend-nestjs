import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto, Score } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiBody, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { RolesGuard } from "../roles.guard";
import { Roles } from "../roles.decorator";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Score.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: VerifyUserDto,
  })
  // @ApiBasicAuth()
  @ApiTags("login")
  async login(@Request() req) {
    return this.userService.login({ username: req.user._doc.username, score: req.user._doc.score as Score });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Score.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async modifyOne(@Param("id") id: string, @Body() modifyUserDto: ModifyUserDto) {
    return this.userService.modifyOne(id, modifyUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Score.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "你没有权限进行该操作!" })
  async deleteOne(@Param("id") id: string) {
    return this.userService.deleteOne(id);
  }
}
