import { Test, TestingModule } from "@nestjs/testing";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { CacheInterceptor } from "@nestjs/common";

describe("PostController", () => {
  let controller: PostController;
  const postService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    })
      .overrideProvider(PostService)
      .useValue(postService)
      .overrideInterceptor(CacheInterceptor)
      .useValue({})
      .compile();

    controller = module.get<PostController>(PostController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
