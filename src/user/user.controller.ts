import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { ModifyUserDto } from "../dto/modify-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }

  @Put(":id")
  modifyOne(@Param("id") id: string, @Body() modifyUserDto: ModifyUserDto) {
    return this.userService.modifyOne(id, modifyUserDto);
  }

  @Delete(":id")
  deleteOneById(@Param("id") id: string) {
    return this.userService.deleteOneById(id);
  }
}
