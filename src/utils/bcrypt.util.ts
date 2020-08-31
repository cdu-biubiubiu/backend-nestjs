import * as bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const round = 10;
  const salt = await bcrypt.genSalt(round);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}
