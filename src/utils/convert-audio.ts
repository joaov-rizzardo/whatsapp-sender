import fs, { ReadStream } from "fs";
import { v4 as uuid } from "uuid";
import Ffmpeg from "fluent-ffmpeg";
import { MEDIA_DIR } from "../init-directories";

export async function convertAudio(input: ReadStream): Promise<Buffer> {
  const filename = `${uuid()}.ogg`;
  const output = `${MEDIA_DIR}/${filename}`;
  const outStream = fs.createWriteStream(output);
  return new Promise((resolve, reject) => {
    Ffmpeg()
      .input(input)
      .audioQuality(96)
      .audioChannels(1)
      .audioCodec("opus")
      .toFormat("opus")
      .addOutputOptions("-avoid_negative_ts make_zero")
      .on("error", (error) => reject(error.message))
      .on("exit", () => reject("Audio recorder exited"))
      .on("close", () => reject("Audio recorder closed"))
      .on("end", () => {
        const file = fs.readFileSync(output);
        fs.unlinkSync(output);
        resolve(file);
      })
      .pipe(outStream, { end: true });
  });
}
