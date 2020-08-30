import { Injectable } from "@nestjs/common";
import { User } from "../interface/user.interface";
import { of } from "rxjs";

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  findAll() {
    return of(this.users);
  }
  createOne(user: User) {
    this.users.push(user);
    return of(user);
  }
  modifyOne(id: string, user: User) {
    return of({
      id,
      user,
    });
  }
  deleteOneById(id: string) {
    return of(id);
  }
}
