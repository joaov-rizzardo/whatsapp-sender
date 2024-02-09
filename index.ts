import express from "express";
import router from "./routes";
import { initDirectories } from "./src/init-directories";
import { initBaileys } from "./src/baileys/baileys";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import Ffmpeg from "fluent-ffmpeg";

Ffmpeg.setFfmpegPath(ffmpegPath.path);

const app = express();
app.use(express.json());
app.use("/", router);
app.all("*", (req, res) => res.status(404).json({ error: "URL not found" }));

const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3006);
const listener = () =>
  console.log(`Server is listening on http://${host}:${port}`);

(async () => {
  initDirectories();
  await initBaileys();
  app.listen(port, listener);
})();
