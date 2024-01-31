import fs from "fs";
import { getSocket } from "../baileys/baileys";
import { MEDIA_DIR } from "../init-directories";

export async function sendVideoMessage(
  jid: string,
  sessionId: string,
  fileName: string,
  caption?: string
) {
  const socket = getSocket(sessionId);
  socket.sendMessage(jid, {
    video: {
      stream: fs.createReadStream(`${MEDIA_DIR}/${fileName}`),
    },
    mimetype: "video/mp4",
    caption,
  });
}
