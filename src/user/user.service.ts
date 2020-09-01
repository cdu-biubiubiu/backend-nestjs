import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
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
    return this.userModel.findById(id).exec();
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    if (await this.findOneByUsername(createUserDto.username)) {
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
    if (!(await this.findOne(objectId))) {
      throw new BadRequestException("用户不存在");
    }
    modifyUserDto.password = await hashPassword(modifyUserDto.password);
    return this.userModel.updateOne({ _id: objectId }, { $set: modifyUserDto }).exec();
  }

  async deleteOne(id: string) {
    let objectId;
    try {
      objectId = new mongo.ObjectId(id);
    } catch {
      throw new BadRequestException("请检查你的id是否有误");
    }
    return this.userModel.deleteOne({ _id: objectId }).exec();
  }

  async validate(user: VerifyUserDto) {
    let foundUser: User;
    foundUser = await this.findOneByUsername(user.username);
    if (!foundUser) {
      throw new BadRequestException("用户不存在");
    }
    if (foundUser && (await verifyPassword(user.password, foundUser.password))) {
      const { password, ...result } = foundUser;
      Logger.debug(result);
      return result;
    } else {
      throw new UnauthorizedException("账户或用户名错误");
    }
  }

  async login(user: { username: string; role: Role; _id: string }) {
    return {
      username: user.username,
      access_token: this.jwtService.sign({ username: user.username, role: user.role, _id: user._id }),
    };
  }

  async modifyPassword(id: string, password: string) {
    password = await hashPassword(password);
    return this.userModel.findByIdAndUpdate({ _id: id }, { $set: { password } }).exec();
  }
  async registry(user: RegistryUserDto) {
    if (await this.findOneByUsername(user.username)) {
      throw new BadRequestException("用户已存在");
    }
    user.role = Role.User;
    user.password = await hashPassword(user.password);
    const createdUser = new this.userModel(user);
    const c = await createdUser.save();
    return filterPassword(c);
  }
}
