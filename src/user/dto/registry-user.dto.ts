import { ApiHideProperty, ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateUserDto, Role } from "./create-user.dto";
import { Allow, IsAlphanumeric, IsEmpty, IsEnum, Length } from "class-validator";

export class RegistryUserDto extends OmitType(CreateUserDto, ["role"] as const) {
  @IsAlphanumeric()
  @Length(6, 16)
  @ApiProperty({
    example: "hanhanhan",
  })
  username: string;
  @IsAlphanumeric()
  @Length(6, 16)
  @ApiProperty({
    example: "hanhanhan",
  })
  password: string;
  @Allow({ groups: [Role.User] })
  @ApiHideProperty()
  role: Role = Role.User;
}
