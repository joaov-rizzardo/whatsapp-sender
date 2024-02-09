import { Boom } from "@hapi/boom";
import makeWASocket, {
  ConnectionState,
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { v4 as uuid } from "uuid";
import fs from "fs";
import { EVENTS_DIR, SESSIONS_FILE_PATH } from "../init-directories";

export type SocketType = ReturnType<typeof makeWASocket>;

export const sessions = new Map<string, SocketType>();

export async function initBaileys() {
  try {
    const storageContent = JSON.parse(
      fs.readFileSync(SESSIONS_FILE_PATH).toString()
    );
    if (!Array.isArray(storageContent)) {
      throw new Error("Invalid storage file");
    }
    for (const session of storageContent) {
      connect(session);
    }
  } catch (error: any) {
    console.error("Não foi possível iniciar o storage: " + error.message);
  }
}

export async function connect(sessionId: string = uuid()) {
  const { state, saveCreds } = await useMultiFileAuthState(
    `${EVENTS_DIR}/${sessionId}`
  );

  const conn = makeWASocket({ auth: state, printQRInTerminal: true });
  sessions.set(sessionId, conn);
  updateSessionsStore();
  conn.ev.on("creds.update", saveCreds);
  conn.ev.on(
    "connection.update",
    async ({ connection, lastDisconnect }: Partial<ConnectionState>) => {
      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        if (shouldReconnect) {
          connect(sessionId);
        } else {
          disconnect(sessionId);
        }
      }
    }
  );
}

export async function disconnect(sessionId: string) {
  sessions.delete(sessionId);
  fs.unlinkSync(`${EVENTS_DIR}/${sessionId}`);
  updateSessionsStore();
}

function updateSessionsStore() {
  fs.writeFileSync(
    SESSIONS_FILE_PATH,
    JSON.stringify(Array.from(sessions.keys()))
  );
}

export function getSocket(sessionId: string) {
  const socket = sessions.get(sessionId);
  if (!socket) {
    throw new Error(`Session not found: ${sessionId}`);
  }
  return socket;
}
