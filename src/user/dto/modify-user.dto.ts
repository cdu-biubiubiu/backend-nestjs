import { ApiProperty } from "@nestjs/swagger";
import { Score } from "./create-user.dto";

export class ModifyUserDto {
  @ApiProperty({})
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty({
    enum: Score,
  })
  score: string;
}
