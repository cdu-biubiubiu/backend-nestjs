import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Score } from "./user/dto/create-user.dto";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Score[]>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.score;
    return roles.includes(userRole);
  }
}
