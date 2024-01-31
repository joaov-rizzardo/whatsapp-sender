import fs from "fs";
import { z } from "zod";
import { InvalidMessageContentError } from "../../errors/invalid-message-content-error";

const MESSAGE_CONTENT_FILE_PATH = "data/message-content.json";

const TextMessageSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  delay: z.number(),
});

const ImageMessageSchema = z.object({
  type: z.literal("image"),
  file: z.string(),
  caption: z.string().optional(),
  delay: z.number(),
});

const VideoMessageSchema = z.object({
  type: z.literal("video"),
  file: z.string(),
  caption: z.string().optional(),
  delay: z.number(),
});

const AudioMessageSchema = z.object({
  type: z.literal("audio"),
  file: z.string(),
  delay: z.number(),
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

  public getMessageContent() {
    return this.messageContent;
  }
}
