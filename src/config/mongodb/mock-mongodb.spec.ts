import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserModule } from "../../user/user.module";
import { Test, TestingModule } from "@nestjs/testing";
import { closeMongeConnection, MockMongodbModule } from "./mock-mongodb.module";
import { UserService } from "../../user/user.service";
import { LinkService } from "../../link/link.service";
import { Connection, Model, mongo } from "mongoose";
import { Link, LinkSchema } from "../../link/link.schema";
import { getConnectionToken, getModelToken, InjectModel, MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../../user/user.schema";
import { CreateLinkDto } from "../../link/dto/create-link.dto";
import { LinkModule } from "../../link/link.module";

describe("test memory mongodb", () => {
  let service: LinkService;
  let connection: Connection;
  let linkModel: Model<Link>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MockMongodbModule({
          connectionName: (Date.now() * Math.random()).toString(16),
        }),
        MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
      ],
      providers: [LinkService],
    }).compile();
    service = module.get<LinkService>(LinkService);
    connection = await module.get(getConnectionToken());
    linkModel = connection.model(Link.name, LinkSchema);
  });
  afterAll(async () => {
    await connection.close();
    await closeMongeConnection();
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  it("should insert document and find it", async () => {
    const link: CreateLinkDto = { name: "namename", src: "srcsrcsrc" };

    const linkDoc = new linkModel(link);
    const id = new mongo.ObjectID(linkDoc._id);
    let savedLink = await linkDoc.save();
    const foundLink = await linkModel.findById(id).exec();
    expect(foundLink.toObject()).toEqual(savedLink.toObject());
  });
});
