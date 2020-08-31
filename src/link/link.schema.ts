import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Link extends Document {
  @Prop()
  name: string;
  @Prop()
  src: string;
}
export const LinkSchema = SchemaFactory.createForClass(Link);
