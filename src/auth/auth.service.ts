import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
