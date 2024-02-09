import fs from "fs";
import { z } from "zod";
import { InvalidMessageContentError } from "../../errors/invalid-message-content-error";
import { generateIntegerRandomNumber } from "../utils/generate-integer-random-number";
import { InsufficientMessageVariationError } from "../../errors/insufficient-message-variation-error";

const MESSAGE_CONTENT_FILE_PATH = "data/message-content.json";

const DelaySchema = {
  min: z.number(),
  max: z.number(),
};

const TextMessageSchema = z.object({
  type: z.literal("text"),
  text: z.array(z.string()),
  delay: z.object(DelaySchema),
});

const ImageMessageSchema = z.object({
  type: z.literal("image"),
  file: z.string(),
  caption: z.string().optional(),
  delay: z.object(DelaySchema),
});

const VideoMessageSchema = z.object({
  type: z.literal("video"),
  file: z.string(),
  caption: z.string().optional(),
  delay: z.object(DelaySchema),
});

const AudioMessageSchema = z.object({
  type: z.literal("audio"),
  file: z.string(),
  delay: z.object(DelaySchema),
});

const MessageItemSchema = z.union([
  TextMessageSchema,
  ImageMessageSchema,
  VideoMessageSchema,
  AudioMessageSchema,
]);

const MessageContentSchema = z.array(MessageItemSchema);

export class MessageContent {
  private messageContent: z.infer<typeof MessageContentSchema>;

  constructor() {
    if (!fs.existsSync(MESSAGE_CONTENT_FILE_PATH)) {
      fs.writeFileSync(MESSAGE_CONTENT_FILE_PATH, "[]");
    }
    const rawContent = fs.readFileSync(MESSAGE_CONTENT_FILE_PATH).toString();
    try {
      this.messageContent = MessageContentSchema.parse(JSON.parse(rawContent));
    } catch {
      throw new InvalidMessageContentError();
    }
  }

  public getRandomVariationIndex(variationsQuantity: number) {
    if (variationsQuantity === 0) throw new InsufficientMessageVariationError();
    if (variationsQuantity === 1) return 0;
    const randomIndex = generateIntegerRandomNumber(0, variationsQuantity - 1);
    return randomIndex;
  }

  public getMessageContent() {
    return this.messageContent;
  }
}
