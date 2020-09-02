import { Test, TestingModule } from "@nestjs/testing";
import { LinkService } from "./link.service";
import { Connection, Model, mongo } from "mongoose";
import { Link, LinkSchema } from "./link.schema";
import { closeMongeConnection, MockMongodbModule } from "../config/mongodb/mock-mongodb.module";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { LinkModule } from "./link.module";
import { CreateLinkDto } from "./dto/create-link.dto";
import { ModifyLinkDto } from "./dto/modify-link.dto";
import { shareReplay } from "rxjs/operators";
import { BadRequestException } from "@nestjs/common";

describe("LinkService", () => {
  let N: number;
  let service: LinkService;
  let connection: Connection;
  let linkModel: Model<Link>;
  let oldLink: Link;
  let oldLinkObjectId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MockMongodbModule({
          connectionName: (Date.now() * Math.random()).toString(16),
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
      ],
      providers: [LinkService],
    }).compile();

    service = module.get<LinkService>(LinkService);
    connection = await module.get(getConnectionToken());
    linkModel = connection.model(Link.name, LinkSchema);
  });
  beforeEach(async () => {
    await linkModel.deleteMany({}).exec();
    const links: CreateLinkDto[] = [
      {
        name: "apple",
        src: "www.apple.com",
      },
      {
        name: "mi",
        src: "www.mi.com",
      },
    ];
    N = links.length;
    await linkModel.insertMany(links);
    oldLink = (await linkModel.find().exec())[0];
    oldLinkObjectId = new mongo.ObjectID(oldLink._id);
  });
  afterAll(async () => {
    await connection.close();
    await closeMongeConnection();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("service should return all document", async () => {
      const links = await service.findAll();
      expect(links.length).toBe(N);
      expect(links[0].toObject()).toEqual(oldLink.toObject());
    });
  });
  describe("createOne", () => {
    it("should create a link", async () => {
      const link: CreateLinkDto = { name: "test", src: "www.test.com" };
      const savedLink = await service.createOne(link);
      const objectId = new mongo.ObjectID(savedLink._id);
      const foundLink = await linkModel.findById(objectId).exec();
      const count = await linkModel.countDocuments().exec();

      expect(foundLink.toObject()).toEqual(savedLink.toObject());
      expect(count).toBe(N + 1);
    });
  });
  describe("modifyOne", () => {
    it("should modify a link", async () => {
      const newLink: ModifyLinkDto = { name: "modify", src: "www.modify.com" };
      const modifyLink = await service.modifyOne(oldLink._id, newLink);
      expect(oldLink.toObject()).toEqual(modifyLink.toObject());
      const foundLink = await linkModel.findById(oldLinkObjectId).exec();
      expect(foundLink.name).toBe(newLink.name);
      expect(foundLink.src).toBe(foundLink.src);
      const count = await linkModel.countDocuments().exec();
      expect(count).toBe(N);
    });
    it("should throw a BadRequestException 400", async () => {
      const badId = "12345";
      const modifyLinkDto: ModifyLinkDto = { name: "modify", src: "www.modify.com" };
      await expect(service.modifyOne(badId, modifyLinkDto)).rejects.toThrow(BadRequestException);
    });
  });
  describe("deleteOne", () => {
    it("should delete a link", async () => {
      const deletedLink = await service.deleteOne(oldLink._id);
      const count = await linkModel.countDocuments().exec();
      expect(count).toBe(N - 1);
      expect(deletedLink.toObject()).toEqual(oldLink.toObject());
    });
    it("should throw a BadRequestException 400", async () => {
      const badId = "12345";
      await expect(service.deleteOne(badId)).rejects.toThrow(BadRequestException);
    });
  });
});
