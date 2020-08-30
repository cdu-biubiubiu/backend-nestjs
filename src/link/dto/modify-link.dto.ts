import { PartialType } from "@nestjs/swagger";
import { CreateLinkDto } from "./create-link.dto";

export class ModifyLinkDto extends PartialType(CreateLinkDto) {}
