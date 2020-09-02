import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto, Role } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { UserService } from "./user.service";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
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
  @ApiOperation({ summary: "获取所有用户信息,权限" })
  async findAll() {
    return await this.userService.findAll();
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
  @ApiBadRequestResponse({
    description: "用户已经存在",
    schema: {
      example: {
        statusCode: 400,
        message: "用户已经存在",
        error: "Bad Request",
      },
    },
  })
  @ApiCreatedResponse({
    description: "创建成功",
    schema: {
      example: {
        // _id: "5f4e3303515e9e07d2b89a8a",
        username: "hanhanhan111111",
        role: "user",
        __v: 0,
      },
    },
  })
  @ApiOperation({ summary: "创建一个用户" })
  async createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: VerifyUserDto,
  })
  @ApiTags("login")
  @ApiOperation({ summary: "用户登录" })
  @ApiBadRequestResponse({
    description: "用户不存在",
    schema: {
      example: {
        statusCode: 400,
        message: "用户不存在",
        error: "Bad Request",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "你的账号或密码不正确",
    schema: {
      example: {
        statusCode: 401,
        message: "账户或用户名错误",
        error: "Unauthorized",
      },
    },
  })
  @ApiCreatedResponse({
    description: "登录成功",
    schema: {
      example: {
        username: "hanhanhan",
        role: "superAdmin",
        _id: "5f4f627dfc695b32813f38e9",
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhbmhhbmhhbiIsImlhdCI6MTU5OTAzODA5OCwiZXhwIjoxNTk5MDQxNjk4fQ.NCYdDSVQXatLuHSRPdT2KLJ3BKIQkSd2Zg4k__lOAxY",
      },
    },
  })
  async login(@Request() req) {
    return this.userService.login(req.user);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: "你没有权限进行该操作!",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "修改失败,请检查你的id是否有错",
    schema: {
      example: {
        statusCode: 400,
        message: "修改失败,请检查你的id是否有误",
        error: "Bad Request",
      },
    },
  })
  @ApiOperation({ summary: "管理员修改用户信息" })
  @ApiOkResponse({
    description: "修改成功",
    schema: {
      example: {
        n: 1,
        nModified: 1,
        ok: 1,
      },
    },
  })
  async modifyOne(@Param("id") id: string, @Body() modifyUserDto: ModifyUserDto) {
    // TODO: 不能把权限修改为超级管理员
    return this.userService.modifyOne(id, modifyUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: "你没有权限进行该操作!",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "修改失败,请检查你的id是否有错",
    schema: {
      example: {
        statusCode: 400,
        message: "修改失败,请检查你的id是否有误",
        error: "Bad Request",
      },
    },
  })
  @ApiOperation({ summary: "管理员删除一名用户" })
  async deleteOne(@Param("id") id: string) {
    // TODO: 超级管理员只被自己管理
    return this.userService.deleteOne(id);
  }

  @Put(":id/password")
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiForbiddenResponse({})
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "修改成功",
    schema: {
      example: {
        _id: "5f4df17660439538ded0e72c",
        username: "hanhanhan",
        role: "user",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "你没有权限进行该操作!",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiOperation({ summary: "修改自己密码" })
  async modifyPassword(@Param("id") id: string, @Body() modifyPasswordDto: ModifyPasswordDto) {
    return this.userService.modifyPassword(id, modifyPasswordDto.password);
  }

  @Post("registry")
  @ApiTags("registry")
  @ApiOperation({ summary: "普通用户注册" })
  @ApiBadRequestResponse({
    description: "用户已存在",
    schema: {
      example: {
        statusCode: 400,
        message: "用户已存在",
        error: "Bad Request",
      },
    },
  })
  @ApiCreatedResponse({
    description: "注册成功",
    schema: {
      example: {
        _id: "5f4f6395166bad001bd7be43",
        username: "hanhan9449",
        role: "user",
        __v: 0,
      },
    },
  })
  async registry(@Body() registryUserDto: RegistryUserDto) {
    return this.userService.registry(registryUserDto);
  }
}
