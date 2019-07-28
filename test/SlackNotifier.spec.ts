import { SlackNotifier } from "../src/SlackNotifier";
import { WebAPICallResult, WebClient } from "@slack/client";
import { LambdaLoggerFactory } from "../src/index";
import CustomError from "./lib/CustomError";
import TestUtility from "./lib/TestUtility";
import { LogLevel } from "../src/LogLevel";

describe("SlackNotifier", () => {
  it.only("should send message to Slack's channel", async () => {
    const client = new WebClient(TestUtility.extractSlackTokenFromEnv());
    const channel = TestUtility.extractSlackChannelFromEnv();

    const slackNotifier = new SlackNotifier(client, channel);

    const customError = new CustomError();

    const lambdaLogger = LambdaLoggerFactory.create(
      LogLevel.DEBUG,
      TestUtility.extractSlackTokenFromEnv(),
      channel
    );
    const loggerContext = await lambdaLogger.alert(customError);

    const result = await (<any>slackNotifier.notify(loggerContext));

    expect(result.ok).toBe(true);
    expect(typeof result.channel).toBe("string");
    expect(typeof result.ts).toBe("string");
    expect(typeof result.message.text).toBe("string");
    expect(typeof result.message.username).toBe("string");
    expect(typeof result.message.bot_id).toBe("string");
    expect(result.message.type).toBe("message");
    expect(result.message.subtype).toBe("bot_message");
    expect(typeof result.message.ts).toBe("string");
    expect(result.response_metadata.scopes).toEqual(["identify", "chat:write:bot"]);
    expect(result.response_metadata.acceptedScopes).toEqual(["chat:write:bot"]);
  });

  it("should return Promise.reject, because the token is invalid", async () => {
    const client = new WebClient("");
    const channel = TestUtility.extractSlackChannelFromEnv();

    const slackNotifier = new SlackNotifier(client, channel);

    const customError = new CustomError();

    const lambdaLogger = LambdaLoggerFactory.create(
      LogLevel.DEBUG,
      TestUtility.extractSlackTokenFromEnv(),
      channel
    );
    const loggerContext = await lambdaLogger.alert(customError);

    await slackNotifier
      .notify(loggerContext)
      .then((result: WebAPICallResult) => {
        fail(result);
      })
      .catch((error: Error) => {
        expect(error.message).toBe("An API error occurred: not_authed");
      });
  });
});
