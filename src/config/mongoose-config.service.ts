import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

interface MongoProfile {
  host: string;
  user: string | undefined;
  password: string | undefined;
  port: string;
}
const getUri = (p: MongoProfile) => {
  let result = "mongodb://";
  if (p.password && p.user && p.password !== "" && p.user !== "") {
    result += `${p.user}:${p.password}@`;
  }
  result += p.host;
  if (p.port && p.port !== "") {
    result += `:${p.port}`;
  }
  return result;
};
@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    const mongoProfile = this.configService.get<MongoProfile>("mongoProfile");
    return {
      uri: getUri(mongoProfile),
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
  }
}
