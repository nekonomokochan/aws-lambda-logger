import { LambdaLoggerFactory } from "../src/index";
import * as util from "util";
import { LogLevel } from "../src/LogLevel";
import TestUtility from "./lib/TestUtility";

describe("LambdaLogger", () => {
  it("should be able to output Debug logs", async () => {
    const messages = ["hello", "world"];

    const lambdaLogger = LambdaLoggerFactory.create(
      LogLevel.INFORMATIONAL,
      TestUtility.extractSlackTokenFromEnv(),
      TestUtility.extractSlackChannelFromEnv()
    );
    const logOutput = await lambdaLogger.debug(messages, true);

    const expectedContext = `DEBUG \n ${util.inspect(messages, false, null)}`;

    expect(logOutput.logLevel).toBe("DEBUG");
    expect(logOutput.context).toBe(expectedContext);
  });
});
