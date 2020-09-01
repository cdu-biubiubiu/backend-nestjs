import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user.service";
import { JwtService } from "@nestjs/jwt";
import { VerifyUserDto } from "../dto/verify-user.dto";
import { verifyPassword } from "../../utils/bcrypt.util";
import { User } from "../user.schema";

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}
  async validateUser(user: VerifyUserDto) {
    let foundUser: User;
    foundUser = await this.userService.findOneByUsername(user.username);
    if (!foundUser) {
      throw new BadRequestException();
    }
    if (foundUser && (await verifyPassword(user.password, foundUser.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }
  async login(user: VerifyUserDto) {
    return {
      username: user.username,
      access_token: this.jwtService.sign({ username: user.username }),
    };
  }
}
