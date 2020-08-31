import { Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { verifyPassword } from "../utils/bcrypt.util";

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}
  async validateUser(user: VerifyUserDto) {
    const foundUser = await this.userService.findOneByUsername(user.username);
    if (user && (await verifyPassword(user.password, foundUser.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: VerifyUserDto) {
    return {
      username: user.username,
      access_token: this.jwtService.sign({ username: user.username }),
    };
  }
}
