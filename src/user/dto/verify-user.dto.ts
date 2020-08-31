import { OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class VerifyUserDto extends OmitType(CreateUserDto, ["score"] as const) {
  password: string;
}
