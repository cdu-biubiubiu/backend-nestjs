import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Role } from "./user/dto/create-user.dto";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role as Role;
    return roles.includes(userRole);
  }
}
