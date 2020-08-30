import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return this.userModel.find().exec();
  }

  async createOne(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async modifyOne(id: string, modifyUserDto: ModifyUserDto) {
    // const modifiedUser = new this.userModel(modifyUserDto)

    return this.userModel.findByIdAndUpdate({ _id: id }, { $set: modifyUserDto }).exec();
  }

  async deleteOne(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
}
