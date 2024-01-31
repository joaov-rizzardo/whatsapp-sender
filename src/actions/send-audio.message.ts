import fs from "fs";
import { getSocket } from "../baileys/baileys";
import { MEDIA_DIR } from "../init-directories";
import { convertAudio } from "../utils/convert-audio";

export async function sendAudioMessage(
  jid: string,
  sessionId: string,
  audioFileName: string
) {
  const socket = getSocket(sessionId);
  socket.sendMessage(jid, {
    audio: await convertAudio(
      fs.createReadStream(`${MEDIA_DIR}/${audioFileName}`)
    ),
    ptt: true,
  });
}
