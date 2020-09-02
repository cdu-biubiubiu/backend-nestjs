import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./post.schema";
import { Model, mongo } from "mongoose";
import { ModifyPostDto } from "./dto/modify-post.dto";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post> {
    let objectId;
    try {
      objectId = new mongo.ObjectId(id);
    } catch {
      throw new BadRequestException("你的id有误");
    }
    return this.postModel.findById({ _id: objectId }).exec();
  }

  async createOne(createPostDto: CreatePostDto): Promise<Post> {
    createPostDto.creationDate = new Date();
    createPostDto.modifiedDate = new Date();
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async modifyOne(id: string, modifyPostDto: ModifyPostDto): Promise<Post> {
    let objectId;
    try {
      objectId = new mongo.ObjectId(id);
    } catch (e) {
      throw new BadRequestException("你的id有误");
    }
    modifyPostDto.modifiedDate = new Date();
    return this.postModel.findByIdAndUpdate({ _id: objectId }, { $set: modifyPostDto }).exec();
  }

  async deleteOne(id: string): Promise<Post> {
    let objectId;
    try {
      objectId = new mongo.ObjectId(id);
    } catch (e) {
      throw new BadRequestException("你的id有误");
    }
    return this.postModel.findOneAndDelete({ _id: objectId }).exec();
  }
}
