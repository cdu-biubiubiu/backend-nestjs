import { User } from "./user.schema";

export function filterPassword(user: User) {
  const { password, ...result } = user.toObject();
  return result;
}
