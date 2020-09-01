import { OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class VerifyUserDto extends OmitType(CreateUserDto, ["role"] as const) {
  password: string;
}
