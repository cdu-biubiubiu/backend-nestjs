import { CacheModule, Module } from "@nestjs/common";
import { LinkController } from "./link.controller";
import { LinkService } from "./link.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Link, LinkSchema } from "./link.schema";

@Module({
  controllers: [LinkController],
  providers: [LinkService],
  imports: [
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    CacheModule.register({
      ttl: 10,
    }),
  ],
})
export class LinkModule {}
