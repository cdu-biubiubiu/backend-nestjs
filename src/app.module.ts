import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkController } from './link/link.controller';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';
import { TestController } from './test/test.controller';

@Module({
  imports: [],
  controllers: [AppController, LinkController, UserController, PostController, TestController],
  providers: [AppService],
})
export class AppModule {}
