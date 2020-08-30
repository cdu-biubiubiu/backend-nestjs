import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { LinkModule } from "./link/link.module";
import { PostModule } from "./post/post.module";
import { TestModule } from "./test/test.module";

@Module({
  imports: [UserModule, LinkModule, PostModule, TestModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
