import { getMongoUri, MongooseConfigService, MongoProfile } from "./mongoose-config.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";

describe("getUri test", () => {
  const host = "host";
  const user = "user";
  const password = "password";
  const port = 27017;

  it("define host", () => {
    const profile: MongoProfile = {
      host,
    };
    expect(getMongoUri(profile)).toBe("mongodb://host");
  });
  it("define user and password", () => {
    const profile: MongoProfile = {
      user,
      password,
    };
    expect(getMongoUri(profile)).toBe(`mongodb://user:password@localhost`);
  });
  it("define user", () => {
    const p: MongoProfile = {
      user,
    };
    expect(getMongoUri(p)).toBe("mongodb://user@localhost");
  });
  it("define all profile", () => {
    const p: MongoProfile = {
      host,
      user,
      password,
      port,
    };
    expect(getMongoUri(p)).toBe("mongodb://user:password@host:27017");
  });
});

describe("mongoose-config service test", () => {
  let service: MongooseConfigService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [MongooseConfigService],
    }).compile();
    service = module.get<MongooseConfigService>(MongooseConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
