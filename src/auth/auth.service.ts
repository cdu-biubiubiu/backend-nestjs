import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { VerifyUserDto } from "../user/dto/verify-user.dto";

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}
  async validateUser(user: VerifyUserDto) {
    return await this.userService.verify(user);
  }
  async login(user: VerifyUserDto) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
