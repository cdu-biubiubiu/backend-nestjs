import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Link } from "./link.schema";
import { Model } from "mongoose";
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
    console.log(modifyLinkDto);
    return this.linkModel.findOneAndUpdate({ _id: id }, { $set: modifyLinkDto }).exec();
  }

  async deleteOne(id: string) {
    return this.linkModel.deleteOne({ _id: id });
  }
}
