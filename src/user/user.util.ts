import { User } from "./user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

export function filterPassword(user: User | CreateUserDto) {
  if (user instanceof User) {
    user = user.toObject();
  }
  const { password, ...result } = user;
  return result;
}
