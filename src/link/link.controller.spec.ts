import { Test, TestingModule } from "@nestjs/testing";
import { LinkController } from "./link.controller";
import { CacheInterceptor, CacheModule } from "@nestjs/common";
import { LinkService } from "./link.service";
import { MockMongodbModule } from "../config/mongodb/mock-mongodb.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Link, LinkSchema } from "./link.schema";

describe("LinkController", () => {
  let controller: LinkController;
  const linkService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkController],
      providers: [LinkService],
    })
      .overrideProvider(LinkService)
      .useValue(linkService)
      .overrideInterceptor(CacheInterceptor)
      .useValue({})
      .compile();

    controller = module.get<LinkController>(LinkController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
