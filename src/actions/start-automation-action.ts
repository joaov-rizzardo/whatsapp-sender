import { InstancesRotation } from "../common/instances-rotation";
import { InvalidNumbers } from "../common/invalid-numbers";
import { MessageContent } from "../common/message-content";
import { NumberHistory } from "../common/number-history";
import { PhoneNumbers } from "../common/phone-numbers";
import { delay } from "../utils/delay";
import { sendTextMessage } from "./send-text-message";
import { sendAudioMessage } from "./send-audio.message";
import { sendVideoMessage } from "./send-video-message";
import { sendImageMessage } from "./send-image-message";
import { SocketType } from "../baileys/baileys";
import { generateFloatRandomNumber } from "../utils/generate-float-random-number";
import { MessagesDelayInterval } from "../common/messages-delay-interval";

export const CONFIGURATION_FILE_PATH = "configs/automation-configs.json";

export let automationStatus: "stopped" | "paused" | "running" = "stopped";

export function setAutomationStatus(status: "stopped" | "paused" | "running") {
  automationStatus = status;
}
export class StartAutomationAction {
  private instancesRotation: InstancesRotation;
  private invalidNumbers: InvalidNumbers;
  private messageContent: MessageContent;
  private numberHistory: NumberHistory;
  private phoneNumbers: PhoneNumbers;
  private messagesDelay: MessagesDelayInterval;

  constructor() {
    this.instancesRotation = new InstancesRotation();
    this.invalidNumbers = new InvalidNumbers();
    this.messageContent = new MessageContent();
    this.numberHistory = new NumberHistory();
    this.phoneNumbers = new PhoneNumbers();
    this.messagesDelay = new MessagesDelayInterval(CONFIGURATION_FILE_PATH);
  }

  async execute() {
    console.log("[ENVIOS]: Iniciando execução");
    while (this.phoneNumbers.size !== 0) {
      try {
        if (automationStatus === "paused") {
          console.log(
            "[ENVIOS]: Pausa solicitada - próxima verificação em 1 min."
          );
          await delay(60 * 1000);
          continue;
        }
        if (automationStatus === "stopped") {
          console.log("[ENVIOS]: Parada solicitada");
          break;
        }
        if (this.messagesDelay.shouldApplyPauseDelay()) {
          console.log("[ENVIOS]: Aguardando delay entre as mensagens");
          await delay(this.messagesDelay.getRandomPauseDelay() * 1000);
          this.messagesDelay.reset();
        }
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
        this.messagesDelay.increment();
        console.log("[ENVIOS] Mensagem enviada para: " + phoneNumber);
      } catch (error: any) {
        console.log(error);
      }
    }
  }

  async executeToContact(
    instance: { socket: SocketType; sessionId: string },
    jid: string
  ) {
    await delay(this.messagesDelay.getRandomMessageDelay() * 1000);
    const steps = this.messageContent.getMessageContent();
    const sessionId = instance.sessionId;
    for (const step of steps) {
      const delaySeconds = generateFloatRandomNumber(
        step.delay.min,
        step.delay.max
      );
      if (step.type === "text") {
        instance.socket.sendPresenceUpdate("composing", jid);
      }
      if (step.type === "audio") {
        instance.socket.sendPresenceUpdate("recording", jid);
      }
      await delay(delaySeconds * 1000);
      if (step.type === "text") {
        const variationIndex = this.messageContent.getRandomVariationIndex(
          step.text.length
        );
        sendTextMessage(jid, sessionId, step.text[variationIndex]);
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
