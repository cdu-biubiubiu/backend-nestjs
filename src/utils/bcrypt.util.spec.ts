import { hashPassword, verifyPassword } from "./bcrypt.util";

describe("bcrypt util", () => {
  const password = "password";
  it("should true when use default value", async () => {
    const hashedPassword = await hashPassword(password);
    expect(verifyPassword(hashedPassword, password)).toBeTruthy();
  });
  it("should use custom salt round", () => {
    const round = "8";
    process.env.SALT_ROUND = round;
    expect(process.env.SALT_ROUND).toBe(round);
  });
  it("should true when use custom salt round", async () => {
    process.env.SALT_ROUND = "8";
    const hashedPassword = await hashPassword(password);
    expect(verifyPassword(hashedPassword, password)).toBeTruthy();
  });
  // TODO: add configModule test
});
