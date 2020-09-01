import { SetMetadata } from "@nestjs/common";
import { Score } from "./user/dto/create-user.dto";

export const Roles = (...roles: Score[]) => SetMetadata("roles", roles);
