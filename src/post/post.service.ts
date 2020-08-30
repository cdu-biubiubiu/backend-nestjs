import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./post.schema";
import { Model } from "mongoose";
import { ModifyPostDto } from "./dto/modify-post.dto";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async findAll() {
    return this.postModel.find().exec();
  }

  async findOne(id: string) {
    return this.postModel.findById({ _id: id }).exec();
  }

  async createOne(createPostDto: CreatePostDto) {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async modifyOne(id: string, modifyPostDto: ModifyPostDto) {
    return this.postModel.findByIdAndUpdate({ _id: id }, { $set: modifyPostDto }).exec();
  }

  async deleteOne(id: string) {
    return this.postModel.deleteOne({ _id: id }).exec();
  }
}
