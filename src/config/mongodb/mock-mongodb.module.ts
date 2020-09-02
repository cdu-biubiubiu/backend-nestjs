import { MongoMemoryServer } from "mongodb-memory-server";
import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

const MockMongodbModule = (customOpts: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = new MongoMemoryServer();
      const uri = await mongod.getUri();
      return {
        uri,
        ...customOpts,
      };
    },
  });
export { MockMongodbModule };
export const closeMongeConnection = async () => {
  if (mongod) await mongod.stop();
};
