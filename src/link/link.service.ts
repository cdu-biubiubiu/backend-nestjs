import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Link } from "./link.schema";
import { Model, mongo } from "mongoose";
import { CreateLinkDto } from "./dto/create-link.dto";
import { ModifyLinkDto } from "./dto/modify-link.dto";

@Injectable()
export class LinkService {
  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {}

  async findAll() {
    return this.linkModel.find().exec();
  }

  async createOne(createLinkDto: CreateLinkDto) {
    const createdLink = new this.linkModel(createLinkDto);
    return createdLink.save();
  }

  async modifyOne(id: string, modifyLinkDto: ModifyLinkDto) {
    let objectId;
    try {
      objectId = new mongo.ObjectID(id);
    } catch (e) {
      throw new BadRequestException("修改失败,请检查你的id是否有错");
    }
    return await this.linkModel.findOneAndUpdate({ _id: objectId }, { $set: modifyLinkDto }).exec();
  }

  async deleteOne(id: string) {
    let objectId;
    try {
      objectId = new mongo.ObjectId(id);
    } catch (e) {
      throw new BadRequestException("删除失败,请检查你的id是否有错");
    }
    return this.linkModel.findOneAndDelete({ _id: objectId }).exec();
  }
}
