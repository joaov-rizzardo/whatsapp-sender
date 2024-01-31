import fs from "fs";

export const SESSIONS_DIR = "sessions";
export const EVENTS_DIR = SESSIONS_DIR + "/events";
export const SESSIONS_FILE_PATH = `${SESSIONS_DIR}/sessions.json`;
export const MEDIA_DIR = "media";

export function initDirectories() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR);
  }
  if (!fs.existsSync(EVENTS_DIR)) {
    fs.mkdirSync(EVENTS_DIR);
  }
  if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR);
  }
  if (!fs.existsSync(SESSIONS_FILE_PATH)) {
    fs.writeFileSync(SESSIONS_FILE_PATH, "[]");
  }
}
