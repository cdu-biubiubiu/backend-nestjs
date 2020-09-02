import { Test, TestingModule } from "@nestjs/testing";
import { LinkController } from "./link.controller";
import { CacheModule } from "@nestjs/common";
import { LinkService } from "./link.service";
import { MockMongodbModule } from "../config/mongodb/mock-mongodb.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Link, LinkSchema } from "./link.schema";

describe("LinkController", () => {
  let controller: LinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkController],
      providers: [LinkService],
      imports: [
        CacheModule.register(),
        MockMongodbModule({
          connectionName: (Date.now() * Math.random()).toString(16),
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
      ],
    }).compile();

    controller = module.get<LinkController>(LinkController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  // it("should return all link", async () => {
  //   const links = await controller.findAll();
  //   console.log(links);
  // });
});
