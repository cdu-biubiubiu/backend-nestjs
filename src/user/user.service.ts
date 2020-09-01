import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto, Score } from "./dto/create-user.dto";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { hashPassword, verifyPassword } from "../utils/bcrypt.util";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await hashPassword(createUserDto.password);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async modifyOne(id: string, modifyUserDto: ModifyUserDto): Promise<User> {
    modifyUserDto.password = await hashPassword(modifyUserDto.password);
    return this.userModel.findByIdAndUpdate({ _id: id }, { $set: modifyUserDto }).exec();
  }

  async deleteOne(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
  async findScoreByUsername(username: string): Promise<Score> {
    const { score } = await this.userModel.findOne({ username }).exec();
    return score as Score;
  }
  async validate(user: VerifyUserDto) {
    let foundUser: User;
    foundUser = await this.findOneByUsername(user.username);
    if (!foundUser) {
      throw new BadRequestException();
    }
    if (foundUser && (await verifyPassword(user.password, foundUser.password))) {
      const { password, ...result } = foundUser;
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }
  async login(user: { username: string; score: Score }) {
    return {
      username: user.username,
      access_token: this.jwtService.sign({ username: user.username, score: user.score }),
    };
  }
}
