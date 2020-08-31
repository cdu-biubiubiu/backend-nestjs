import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { LinkModule } from "./link/link.module";
import { PostModule } from "./post/post.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "./config/mongoose-config.service";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import AppConfig from "./config/app.config";
import MongodbConfig from "./config/mongodb.config";

@Module({
  imports: [
    UserModule,
    LinkModule,
    PostModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, MongodbConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MongooseConfigService],
})
export class AppModule {}
