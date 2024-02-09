import { z } from "zod";
import fs from "fs";
import { InvalidIntervalConfigFile } from "../../errors/invalid-interval-config-file-error";
import { generateIntegerRandomNumber } from "../utils/generate-integer-random-number";
import { generateFloatRandomNumber } from "../utils/generate-float-random-number";

const IntervalConfigSchema = z.object({
  min: z.number(),
  max: z.number(),
});

type IntervalType = z.infer<typeof IntervalConfigSchema>;

const ConfigurationFileSchema = z.object({
  messages_delay: IntervalConfigSchema,
  messages_pause_quantity: IntervalConfigSchema,
  messages_pause_delay: IntervalConfigSchema,
});

export class MessagesDelayInterval {
  private messagesDelay: IntervalType;
  private messagesPauseQuantity: IntervalType;
  private messagesPauseDelay: IntervalType;
  private sentMessagesQuantity: number = 0;
  private currentMessagesPauseQuantity: number = 0;

  constructor(configurationFilePath: string) {
    try {
      const fileContent = JSON.parse(
        fs.readFileSync(configurationFilePath).toString()
      );
      const parsedContent = ConfigurationFileSchema.parse(fileContent);
      this.messagesPauseDelay = parsedContent.messages_pause_delay;
      this.messagesPauseQuantity = parsedContent.messages_pause_quantity;
      this.messagesDelay = parsedContent.messages_delay;
      this.reset();
    } catch {
      throw new InvalidIntervalConfigFile();
    }
  }

  public reset() {
    this.currentMessagesPauseQuantity = generateIntegerRandomNumber(
      this.messagesPauseQuantity.min,
      this.messagesPauseQuantity.max
    );
    this.sentMessagesQuantity = 0;
  }

  public getRandomPauseDelay() {
    return generateFloatRandomNumber(
      this.messagesPauseDelay.min,
      this.messagesPauseDelay.max
    );
  }

  public getRandomMessageDelay() {
    return generateFloatRandomNumber(
      this.messagesDelay.min,
      this.messagesDelay.max
    );
  }

  public increment() {
    this.sentMessagesQuantity++;
  }

  public shouldApplyPauseDelay() {
    return this.sentMessagesQuantity === this.currentMessagesPauseQuantity;
  }
}
