import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model, mongo } from "mongoose";
import { CreateUserDto, Role } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { verifyPassword } from "../utils/bcrypt.util";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { JwtService } from "@nestjs/jwt";
import { filterPassword } from "./user.util";
import { RegistryUserDto } from "./dto/registry-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    let objectId;
    try {
      objectId = new mongo.ObjectID(id);
    } catch (e) {
      throw new BadRequestException();
    }
    const user = await this.userModel.findById(objectId).exec();
    if (!user) {
      throw new NotFoundException();
    }
    return filterPassword(user);
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

  async deleteOne(id: string) {
    const found = await this.userModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException("资源不存在");
    }
    if (found.role === Role.SuperAdmin) {
      throw new ForbiddenException("不能删除超级管理员");
    }
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async validate(user: VerifyUserDto) {
    let foundUser: User;
    foundUser = await this.userModel.findOne({ username: user.username }).exec();
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
    const u = await this.userModel.findOne({ username: user.username }).exec();
    return {
      token: this.jwtService.sign(user),
    };
  }

  async modifyPassword(id: string, password: string) {
    const user = await this.userModel.findByIdAndUpdate({ _id: id }, { $set: { password } }).exec();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async registry(user: RegistryUserDto) {
    const found = await this.userModel.findOne({ username: user.username }).exec();
    if (found) {
      throw new ForbiddenException("用户已存在");
    }
    const createdUser = new this.userModel(user);
    const c = await createdUser.save();
    return c;
  }
}
