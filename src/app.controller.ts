import { Controller, Get, Redirect } from "@nestjs/common";
import { ApiHideProperty, ApiTags } from "@nestjs/swagger";

@Controller()
export class AppController {
  @Get()
  @Redirect("/api")
  @ApiTags("redirect")
  goApi() {}
}
