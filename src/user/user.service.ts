import { BadRequestException, GoneException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model, mongo, Types } from "mongoose";
import { CreateUserDto, Role } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { hashPassword, verifyPassword } from "../utils/bcrypt.util";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { JwtService } from "@nestjs/jwt";
import { filterPassword } from "./user.util";
import { RegistryUserDto } from "./dto/registry-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {}

  async findAll(): Promise<any[]> {
    const users = await this.userModel.find().exec();
    return users.map(filterPassword);
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
      throw new GoneException();
    }
    return filterPassword(user);
  }

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const found = await this.userModel.findOne({ username: createUserDto.username }).exec();
    if (found) {
      throw new BadRequestException("用户已经存在");
    }
    createUserDto.password = await hashPassword(createUserDto.password);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async modifyOne(id: string, modifyUserDto: ModifyUserDto): Promise<User> {
    let objectId;
    try {
      objectId = new mongo.ObjectId(id);
    } catch (e) {
      throw new BadRequestException("修改失败,请检查你的id是否有误");
    }
    modifyUserDto.password = await hashPassword(modifyUserDto.password);
    const user = await this.userModel.findByIdAndUpdate(objectId, { $set: modifyUserDto }).exec();
    if (!user) {
      throw new GoneException("用户不存在");
    }
    return user;
  }

  async deleteOne(id: string) {
    let objectId;
    try {
      objectId = new mongo.ObjectId(id);
    } catch {
      throw new BadRequestException("请检查你的id是否有误");
    }
    const user = await this.userModel.findByIdAndDelete({ _id: objectId }).exec();
    if (!user) {
      throw new GoneException("用户已被删除");
    }
    return user;
  }

  async validate(user: VerifyUserDto) {
    let foundUser: User;
    foundUser = await this.userModel.findOne({ username: user.username }).exec();
    if (!foundUser) {
      throw new BadRequestException("用户不存在");
    }
    if (await verifyPassword(user.password, foundUser.password)) {
      const { password, ...result } = foundUser.toObject();
      return result;
    } else {
      throw new UnauthorizedException("账户或用户名错误");
    }
  }

  async login(user: VerifyUserDto) {
    const u = await this.userModel.findOne({ username: user.username }).exec();
    return {
      username: user.username,
      role: u.role,
      _id: u._id,
      access_token: this.jwtService.sign({ username: user.username }),
    };
  }

  async modifyPassword(id: string, password: string) {
    password = await hashPassword(password);
    let objectId;
    try {
      objectId = new mongo.ObjectID(id);
    } catch (e) {
      throw new BadRequestException();
    }
    const user = await this.userModel.findByIdAndUpdate({ _id: id }, { $set: { password } }).exec();
    if (!user) {
      throw new GoneException();
    }
    return filterPassword(user);
  }
  async registry(user: RegistryUserDto) {
    const found = await this.userModel.findOne({ username: user.username }).exec();
    if (found) {
      throw new BadRequestException("用户已存在");
    }

    user.role = Role.User;
    user.password = await hashPassword(user.password);
    const createdUser = new this.userModel(user);
    const c = await createdUser.save();
    return filterPassword(c);
  }
}
