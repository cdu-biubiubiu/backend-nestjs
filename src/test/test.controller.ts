import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("test")
@Controller("test")
export class TestController {
  @Get()
  get() {
    return "test get";
  }
  @Post()
  post() {
    return "test post";
  }
  @Put()
  put() {
    return "test put";
  }

  @Delete()
  delete() {
    return "test delete";
  }
}
