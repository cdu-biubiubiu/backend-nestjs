import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto, Role } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { RolesGuard } from "../roles.guard";
import { Roles } from "../roles.decorator";
import { SelfGuard } from "../self.guard";
import { ModifyPasswordDto } from "./dto/modify-password.dto";
import { RegistryUserDto } from "./dto/registry-user.dto";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  async createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: VerifyUserDto,
  })
  @ApiTags("login")
  async login(@Request() req) {
    return this.userService.login(req.user._doc);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  async modifyOne(@Param("id") id: string, @Body() modifyUserDto: ModifyUserDto) {
    return this.userService.modifyOne(id, modifyUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  async deleteOne(@Param("id") id: string) {
    return this.userService.deleteOne(id);
  }
  @Put(":id/password")
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({})
  @ApiBearerAuth()
  async modifyPassword(@Param("id") id: string, @Body() modifyPasswordDto: ModifyPasswordDto) {
    return this.userService.modifyPassword(id, modifyPasswordDto.password);
  }
  @Post("registry")
  async registry(@Body() registryUserDto: RegistryUserDto) {
    return this.userService.registry(registryUserDto);
  }
}
