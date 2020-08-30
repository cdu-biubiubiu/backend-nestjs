import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { LinkModule } from "./link/link.module";
import { PostModule } from "./post/post.module";
import { TestModule } from "./test/test.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "./mongoose-config/mongoose-config.service";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    LinkModule,
    PostModule,
    TestModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [AppService, MongooseConfigService],
})
export class AppModule {}
