import { OmitType, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class VerifyUserDto extends PickType(CreateUserDto, ["username", "password"] as const) {}
