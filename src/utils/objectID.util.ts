import { BadRequestException } from "@nestjs/common";
import { mongo } from "mongoose";

export const verifyAndConvertObjectID = (id: string) => {
  let objectID;
  try {
    objectID = new mongo.ObjectID(id);
  } catch (e) {
    throw new BadRequestException();
  }
  return objectID;
};
