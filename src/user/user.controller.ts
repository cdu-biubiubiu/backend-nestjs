import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto, Role } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { UserService } from "./user.service";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
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
import { verifyAndConvertObjectID } from "../utils/objectID.util";
import { hasPropertyKey } from "@nestjs/swagger/dist/plugin/utils/plugin-utils";
import { hashPassword } from "../utils/bcrypt.util";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "获取所有用户信息,权限" })
  @ApiOkResponse({
    description: "成功",
    schema: {
      example: [
        {
          _id: "5f4f6db5f072dcf573e9f601",
          username: "hanhanhan",
          role: "superAdmin",
        },
        {
          _id: "5f4f6db5f072dcf573e9f602",
          username: "xiaoming",
          role: "admin",
        },
        {
          _id: "5f4f6db5f072dcf573e9f603",
          username: "lihua",
          role: "user",
        },
        {
          _id: "5f4f6db5f072dcf573e9f604",
          username: "xiaoyue",
          role: "user",
        },
      ],
    },
  }) // 200
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => ({
      _id: user._id,
      username: user.username,
      role: user.role,
    }));
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
  }) // 401
  @ApiForbiddenResponse({
    description: "用户已经存在",
    schema: {
      example: {
        statusCode: 403,
        message: "用户已经存在",
        error: "Forbidden",
      },
    },
  }) // 403
  @ApiCreatedResponse({
    description: "创建成功",
    schema: {
      example: {
        _id: "5f4faa46d573d9745d6e0d09",
        username: "hanhanhan225",
        role: "user",
      },
    },
  }) // 201
  @ApiOperation({ summary: "创建一个用户" })
  async createOne(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await hashPassword(createUserDto.password);
    const user = await this.userService.createOne(createUserDto);
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
    };
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: VerifyUserDto,
  })
  @ApiTags("login")
  @ApiOperation({ summary: "用户登录" })
  @ApiForbiddenResponse({
    description: "用户不存在",
    schema: {
      example: {
        statusCode: 403,
        message: "用户不存在",
        error: "Forbidden",
      },
    },
  }) // 403
  @ApiUnauthorizedResponse({
    description: "你的账号或密码不正确",
    schema: {
      example: {
        statusCode: 401,
        message: "账户或用户名错误",
        error: "Unauthorized",
      },
    },
  }) // 401
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
  }) // 201
  async login(@Request() req) {
    const res = await this.userService.login(req.user);
    return {
      username: req.user.username,
      role: req.user.role,
      _id: req.user._id,
      access_token: res.token,
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: "管理员修改用户信息" })
  @ApiOkResponse({
    description: "修改成功",
    schema: {
      example: {
        _id: "5f4f6db5f072dcf573e9f601",
        username: "lihuad",
        role: "user",
      },
    },
  }) // 200
  @ApiBadRequestResponse({
    description: "修改失败,请检查你的id是否有错",
    schema: {
      example: {
        statusCode: 400,
        message: "修改失败,请检查你的id是否有误",
        error: "Bad Request",
      },
    },
  }) // 400
  @ApiUnauthorizedResponse({
    description: "你没有权限进行该操作!",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  }) // 401
  @ApiForbiddenResponse({
    description: "不能修改为超级管理员",
    schema: {
      example: {
        statusCode: 403,
        message: "不能修改为超级管理员",
        error: "Forbidden",
      },
    },
  }) // 403
  @ApiNotFoundResponse({
    description: "用户不存在",
    schema: {
      example: {
        statusCode: 404,
        message: "用户不存在",
        error: "Not Found",
      },
    },
  }) // 404
  async modifyOne(@Param("id") id: string, @Body() modifyUserDto: ModifyUserDto) {
    id = verifyAndConvertObjectID(id);
    if (modifyUserDto.role === Role.SuperAdmin) {
      throw new ForbiddenException("不能修改为超级管理员");
    }
    modifyUserDto.password = await hashPassword(modifyUserDto.password);
    const user = await this.userService.modifyOne(id, modifyUserDto);
    if (!user) {
      throw new NotFoundException("用户不存在");
    }
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: "管理员删除一名用户" })
  @ApiOkResponse({
    description: "删除成功",
    schema: {
      example: {
        _id: "5f4f6db5f072dcf573e9f602",
        username: "xiaoming",
        role: "admin",
      },
    },
  }) // 200
  @ApiOperation({ summary: "删除一名用户" })
  @ApiBadRequestResponse({
    description: "修改失败,请检查你的id是否有错",
    schema: {
      example: {
        statusCode: 400,
        message: "修改失败,请检查你的id是否有误",
        error: "Bad Request",
      },
    },
  }) // 400
  @ApiUnauthorizedResponse({
    description: "你没有权限进行该操作!",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  }) // 401
  @ApiForbiddenResponse({
    description: "不能删除超级管理员",
    schema: {
      example: {
        statusCode: 403,
        message: "不能删除超级管理员",
        error: "Forbidden",
      },
    },
  }) // 403
  @ApiNotFoundResponse({
    description: "资源不存在",
    schema: {
      example: {
        statusCode: 404,
        message: "资源不存在",
        error: "Not Found",
      },
    },
  }) // 404
  async deleteOne(@Param("id") id: string) {
    id = verifyAndConvertObjectID(id);
    const user = await this.userService.deleteOne(id);
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
    };
  }

  @Put(":id/password")
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiForbiddenResponse({})
  @ApiBearerAuth()
  @ApiOperation({ summary: "修改自己密码" })
  @ApiOkResponse({
    description: "修改成功",
    schema: {
      example: {
        _id: "5f4df17660439538ded0e72c",
        username: "hanhanhan",
        role: "user",
      },
    },
  }) // 200
  @ApiBadRequestResponse({
    description: "id错误",
    schema: {
      example: {
        statusCode: 400,
        message: "id错误",
        error: "Bad Request",
      },
    },
  }) // 400
  @ApiUnauthorizedResponse({
    description: "你没有权限进行该操作!",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  }) // 401
  @ApiNotFoundResponse({
    description: "资源未找到",
  }) // 404
  async modifyPassword(@Param("id") id: string, @Body() modifyPasswordDto: ModifyPasswordDto) {
    id = verifyAndConvertObjectID(id);
    const password = await hashPassword(modifyPasswordDto.password);
    const user = await this.userService.modifyPassword(id, password);
    return {
      _id: user._id,
      username: user.username,
      password: user.password,
    };
  }

  @Post("registry")
  @ApiTags("registry")
  @ApiOperation({ summary: "普通用户注册" })
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
  }) // 201
  @ApiForbiddenResponse({
    description: "用户名已存在",
    schema: {
      example: {
        statusCode: 403,
        message: "用户已存在",
        error: "Forbidden",
      },
    },
  }) // 403
  async registry(@Body() registryUserDto: RegistryUserDto) {
    registryUserDto.role = Role.User;
    registryUserDto.password = await hashPassword(registryUserDto.password);
    const user = await this.userService.registry(registryUserDto);
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
    };
  }
}
