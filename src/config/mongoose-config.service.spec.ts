import { getUri, MongooseConfigService, MongoProfile } from "./mongoose-config.service";

describe("getUri test", () => {
  const host = "host";
  const user = "user";
  const password = "password";
  const port = 27017;

  it("define host", () => {
    const profile: MongoProfile = {
      host,
    };
    expect(getUri(profile)).toEqual("mongodb://host");
  });
  it("define user and password", () => {
    const profile: MongoProfile = {
      user,
      password,
    };
    expect(getUri(profile)).toEqual(`mongodb://user:password@localhost`);
  });
  it("define user", () => {
    const p: MongoProfile = {
      user,
    };
    expect(getUri(p)).toEqual("mongodb://user@localhost");
  });
  it("define all profile", () => {
    const p: MongoProfile = {
      host,
      user,
      password,
      port,
    };
    expect(getUri(p)).toEqual("mongodb://user:password@host:27017");
  });
});
