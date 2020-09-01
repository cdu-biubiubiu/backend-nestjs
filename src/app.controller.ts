import { Controller, Get, Redirect } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiHideProperty, ApiTags } from "@nestjs/swagger";

@Controller()
export class AppController {
  @Get()
  @Redirect("/api")
  @ApiExcludeEndpoint()
  goApi() {}
}
