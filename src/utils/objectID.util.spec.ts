import { verifyAndConvertObjectID } from "./objectID.util";
import { mongo } from "mongoose";
import { BadRequestException } from "@nestjs/common";

describe("objectID util", () => {
  it("should return ObjectID", () => {
    const id = "5f4f6395166bad001bd7be43";
    expect(() => verifyAndConvertObjectID(id)).not.toThrow();
  });
  it("should throw 400", () => {
    const badId = "123";
    expect(() => verifyAndConvertObjectID(badId)).toThrow(BadRequestException);
  });
});
