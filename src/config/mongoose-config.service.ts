import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

export interface MongoProfile {
  host?: string;
  user?: string;
  password?: string;
  port?: string | number;
}
export const getUri = (p: MongoProfile) => {
  let result = "mongodb://";
  result += p.user ? `${p.user}` : "";
  result += p.password ? `:${p.password}` : "";
  result += p.user ? "@" : "";
  result += p.host || "localhost";
  result += p.port ? `:${p.port}` : "";
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
