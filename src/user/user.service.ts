import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { hashPassword, verifyPassword } from "../utils/bcrypt.util";
import { VerifyUserDto } from "./dto/verify-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return this.userModel.find().exec();
  }
  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }
  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async createOne(createUserDto: CreateUserDto) {
    createUserDto.password = await hashPassword(createUserDto.password);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async modifyOne(id: string, modifyUserDto: ModifyUserDto) {
    // const modifiedUser = new this.userModel(modifyUserDto)

    modifyUserDto.password = await hashPassword(modifyUserDto.password);
    return this.userModel.findByIdAndUpdate({ _id: id }, { $set: modifyUserDto }).exec();
  }

  async deleteOne(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
  async verify(verifyUserDto: VerifyUserDto) {
    const user = await this.userModel.findOne({ username: verifyUserDto.username }).exec();
    if (user && (await verifyPassword(verifyUserDto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
