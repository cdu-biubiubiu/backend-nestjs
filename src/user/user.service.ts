import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto, Role } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { verifyPassword } from "../utils/bcrypt.util";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { JwtService } from "@nestjs/jwt";
import { RegistryUserDto } from "./dto/registry-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    // TODO
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const found = await this.userModel.findOne({ username: createUserDto.username }).exec();
    if (found) {
      throw new ForbiddenException("用户已经存在");
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async modifyOne(id, modifyUserDto: ModifyUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, { $set: modifyUserDto }).exec();
  }

  async deleteOne(id) {
    const found = await this.userModel.findById(id).exec();
    // TODO
    if (!found) {
      throw new NotFoundException("资源不存在");
    }
    // TODO
    if (found.role === Role.SuperAdmin) {
      throw new ForbiddenException("不能删除超级管理员");
    }
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async validate(user: VerifyUserDto) {
    let foundUser: User;
    foundUser = await this.userModel.findOne({ username: user.username }).exec();
    // TODO
    if (!foundUser) {
      throw new ForbiddenException("用户不存在");
    }
    if (await verifyPassword(user.password, foundUser.password)) {
      const { password, ...result } = foundUser.toObject();
      return result;
    } else {
      throw new UnauthorizedException("用户名或密码错误");
    }
  }

  async login(user: any) {
    return {
      token: this.jwtService.sign(user),
    };
  }

  async modifyPassword(id: string, password: string) {
    const user = await this.userModel.findByIdAndUpdate({ _id: id }, { $set: { password } }).exec();
    // TODO
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async registry(user: RegistryUserDto) {
    const found = await this.userModel.findOne({ username: user.username }).exec();
    // TODO
    if (found) {
      throw new ForbiddenException("用户已存在");
    }
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }
}
