import fs from "fs";
import { z } from "zod";
import { InvalidMessageContentError } from "../../errors/invalid-message-content-error";
import { InsufficientMaturationMessageContentError } from "../../errors/insufficient-maturation-message-content-error";
import { generateIntegerRandomNumber } from "../utils/generate-integer-random-number";

const MATURATION_CONTENT_FILE_PATH = "configs/maturation-messages.json";

const TextMessageSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const ImageMessageSchema = z.object({
  type: z.literal("image"),
  file: z.string(),
  caption: z.string().optional(),
});

const VideoMessageSchema = z.object({
  type: z.literal("video"),
  file: z.string(),
  caption: z.string().optional(),
});

const AudioMessageSchema = z.object({
  type: z.literal("audio"),
  file: z.string(),
});

const MessageItemSchema = z.union([
  TextMessageSchema,
  ImageMessageSchema,
  VideoMessageSchema,
  AudioMessageSchema,
]);

const MessageContentSchema = z.array(MessageItemSchema);

export class MaturationContent {
  private messageContent: z.infer<typeof MessageContentSchema>;

  constructor() {
    if (!fs.existsSync(MATURATION_CONTENT_FILE_PATH)) {
      fs.writeFileSync(MATURATION_CONTENT_FILE_PATH, "[]");
    }
    const rawContent = fs.readFileSync(MATURATION_CONTENT_FILE_PATH).toString();
    try {
      this.messageContent = MessageContentSchema.parse(JSON.parse(rawContent));
    } catch {
      throw new InvalidMessageContentError();
    }
  }

  getRandomContent() {
    if (this.messageContent.length <= 1) {
      throw new InsufficientMaturationMessageContentError();
    }
    const randomIndex = generateIntegerRandomNumber(
      0,
      this.messageContent.length - 1
    );
    return this.messageContent[randomIndex];
  }
}
