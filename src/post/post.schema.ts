import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Post extends Document {
  @Prop({ type: String })
  title: string;
  @Prop({ type: String })
  content: string;
  @Prop({ type: Date })
  creationDate: Date;
  @Prop({ type: Date })
  modifiedDate: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
