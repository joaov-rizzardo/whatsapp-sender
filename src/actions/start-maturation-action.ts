import { MaturationRandomSocket } from "../common/maturation-random-socket";
import { delay } from "../utils/delay";
import { SocketType } from "../baileys/baileys";
import { MaturationContent } from "../common/maturation-content";
import { sendTextMessage } from "./send-text-message";
import { sendAudioMessage } from "./send-audio.message";
import { sendVideoMessage } from "./send-video-message";
import { sendImageMessage } from "./send-image-message";
import { InstancesRotation } from "../common/instances-rotation";
import { MessagesDelayInterval } from "../common/messages-delay-interval";

export const CONFIGURATION_FILE_PATH: string =
  "configs/maturation-configs.json";

export let maturationStatus: "stopped" | "paused" | "running" = "stopped";

export function setMaturationStatus(status: "stopped" | "paused" | "running") {
  maturationStatus = status;
}

export class StartMaturationAction {
  private maturationContent: MaturationContent;
  private instancesRotation: InstancesRotation;
  private messagesDelay: MessagesDelayInterval;

  constructor() {
    this.maturationContent = new MaturationContent();
    this.instancesRotation = new InstancesRotation();
    this.messagesDelay = new MessagesDelayInterval(CONFIGURATION_FILE_PATH);
  }

  async execute() {
    console.log("[MATURAÇÃO]: Iniciando processo");
    while (true) {
      if (maturationStatus === "paused") {
        console.log(
          "[MATURAÇÃO]: Pausa solicitada - próxima verificação em 1 min."
        );
        await delay(60 * 1000);
        continue;
      }
      if (maturationStatus === "stopped") {
        console.log("[MATURAÇÃO]: Parada solicitada");
        break;
      }
      if (this.messagesDelay.shouldApplyPauseDelay()) {
        await this.applyDelay();
      }
      const instance = this.instancesRotation.getNextInstance();
      const contactTarget = MaturationRandomSocket.getRandomJid();
      await this.executeToContact(instance, contactTarget);
      this.messagesDelay.increment();
    }
    console.log("[MATURAÇÃO]: Fim do processo");
  }

  private async executeToContact(
    instance: { socket: SocketType; sessionId: string },
    jid: string
  ) {
    try {
      await delay(this.messagesDelay.getRandomMessageDelay() * 1000);
      console.log(
        `[MATURAÇÃO]: Enviando mensagem de ${instance?.socket?.user?.id} para ${jid}`
      );
      const content = this.maturationContent.getRandomContent();
      if (content.type === "text") {
        sendTextMessage(jid, instance.sessionId, content.text);
      }
      if (content.type === "audio") {
        await sendAudioMessage(jid, instance.sessionId, content.file);
      }
      if (content.type === "image") {
        sendImageMessage(jid, instance.sessionId, {
          imageName: content.file,
          caption: content.caption,
        });
      }
      if (content.type === "video") {
        await sendVideoMessage(
          jid,
          instance.sessionId,
          content.file,
          content.caption
        );
      }
    } catch (error: any) {
      console.log(`[MATURAÇÃO]: Erro ao enviar mensagem - ${error.message}`);
    }
  }

  private async applyDelay() {
    console.log("[MATURAÇÃO]: Aguardando delay entre as mensagens");
    await delay(this.messagesDelay.getRandomPauseDelay() * 1000);
    console.log("[MATURAÇÃO]: Prosseguindo com a execução");
    this.messagesDelay.reset();
  }
}
