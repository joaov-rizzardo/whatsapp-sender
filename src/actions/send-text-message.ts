import { getSocket } from "../baileys/baileys";

export function sendTextMessage(
  jid: string,
  sessionId: string,
  message: string
) {
  const socket = getSocket(sessionId);
  socket.sendMessage(jid, {
    text: message,
  });
}
