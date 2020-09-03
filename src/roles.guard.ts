import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Role } from "./user/dto/create-user.dto";

/**
 * 超级用户可以做任何操作
 * 除了超级用户都不能动超级用户
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    const user = request.user;
    const userRole = user.role as Role;
    if (userRole === Role.SuperAdmin) {
      return true;
    } else if (body.role === Role.SuperAdmin) {
      return false;
    }
    return roles.includes(userRole);
  }
}
