import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { LinkModule } from "./link/link.module";
import { PostModule } from "./post/post.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "./config/mongoose-config.service";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    UserModule,
    LinkModule,
    PostModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MongooseConfigService],
})
export class AppModule {}
