import { SelfGuard } from "./self.guard";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { ExecutionContext } from "@nestjs/common";

describe("SelfGuard", () => {
  it("should be defined", () => {
    expect(new SelfGuard()).toBeDefined();
  });
});
