import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "../user.service";
import { VerifyUserDto } from "../dto/verify-user.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super();
  }
  async validate(username: string, password: string) {
    return this.userService.validate({ username, password });
  }
}
