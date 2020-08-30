import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  score: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
