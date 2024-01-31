import { InstancesRotation } from "../common/instances-rotation";
import { InvalidNumbers } from "../common/invalid-numbers";
import { MessageContent } from "../common/message-content";
import { NumberHistory } from "../common/number-history";
import { PhoneNumbers } from "../common/phone-numbers";
import { delay } from "../utils/delay";
import { sendTextMessage } from "./send-text-message";
import { sendAudioMessage } from "./send-audio.message";
import { sendVideoMessage } from "./send-video-message";
import { ImageMessageType, sendImageMessage } from "./send-image-message";
import { SocketType } from "../baileys/baileys";

export class StartAutomationAction {
  private instancesRotation: InstancesRotation;
  private invalidNumbers: InvalidNumbers;
  private messageContent: MessageContent;
  private numberHistory: NumberHistory;
  private phoneNumbers: PhoneNumbers;

  constructor() {
    this.instancesRotation = new InstancesRotation();
    this.invalidNumbers = new InvalidNumbers();
    this.messageContent = new MessageContent();
    this.numberHistory = new NumberHistory();
    this.phoneNumbers = new PhoneNumbers();
  }

  async execute() {
    while (this.phoneNumbers.size !== 0) {
      try {
        const phoneNumber = this.phoneNumbers.getNextNumber() as string;
        const instance = this.instancesRotation.getNextInstance();
        const { exists, jid } = (
          await instance.socket.onWhatsApp(phoneNumber)
        )[0];
        if (!exists) {
          this.invalidNumbers.add(phoneNumber);
          continue;
        }
        await this.executeToContact(instance, jid);
        this.numberHistory.add(phoneNumber);
        console.log("Enviado para: " + phoneNumber);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }

  async executeToContact(
    instance: { socket: SocketType; sessionId: string },
    jid: string
  ) {
    const steps = this.messageContent.getMessageContent();
    const sessionId = instance.sessionId;
    for (const step of steps) {
      await delay(step.delay * 1000);
      if (step.type === "text") {
        sendTextMessage(jid, sessionId, step.text);
      }
      if (step.type === "audio") {
        await sendAudioMessage(jid, sessionId, step.file);
      }
      if (step.type === "video") {
        await sendVideoMessage(jid, sessionId, step.file, step.caption);
      }
      if (step.type === "image") {
        sendImageMessage(jid, sessionId, {
          imageName: step.file,
          caption: step.caption,
        });
      }
    }
  }
}
