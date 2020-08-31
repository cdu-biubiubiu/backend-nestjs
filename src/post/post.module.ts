import { CacheModule, Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./post.schema";

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), CacheModule.register()],
})
export class PostModule {}
