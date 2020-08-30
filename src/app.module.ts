import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkController } from './controller/link/link.controller';
import { UserController } from './controller/user/user.controller';
import { PostController } from './controller/post/post.controller';
import { TestController } from './controller/test/test.controller';

@Module({
  imports: [],
  controllers: [AppController, LinkController, UserController, PostController, TestController],
  providers: [AppService],
})
export class AppModule {}
