import fs from "fs";
import { MEDIA_DIR } from "../init-directories";
import { getSocket } from "../baileys/baileys";

export type ImageMessageType = {
  imageName: string;
  caption?: string;
};
export function sendImageMessage(
  jid: string,
  sessionId: string,
  { imageName, caption }: ImageMessageType
) {
  const socket = getSocket(sessionId);
  socket.sendMessage(jid, {
    image: fs.readFileSync(`${MEDIA_DIR}/${imageName}`),
    caption,
  });
}
