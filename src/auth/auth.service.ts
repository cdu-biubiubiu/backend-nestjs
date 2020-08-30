import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../interface/user.interface";

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: User) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
