import { MaturationHaveOnlyOneInstanceError } from "../../errors/maturation-have-only-one-instance-error";
import { NoInstancesConnectedError } from "../../errors/no-instances-connected-error";
import { sessions } from "../baileys/baileys";
import { generateIntegerRandomNumber } from "../utils/generate-integer-random-number";

export class MaturationRandomSocket {
  static getRandomSocket() {
    const instance = this.getRandomInstance();
    return {
      sessionId: instance[0],
      socket: instance[1],
    };
  }

  static getRandomJid() {
    const instance = this.getRandomInstance();
    if (!instance[1]?.user) {
      throw new Error("Cannot access instance user");
    }
    return instance[1].user.id;
  }

  static getRandomInstance() {
    const instances = Array.from(sessions.entries());
    if (instances.length <= 0) {
      throw new NoInstancesConnectedError();
    }
    if (instances.length === 1) {
      throw new MaturationHaveOnlyOneInstanceError();
    }
    const randomIndex = generateIntegerRandomNumber(0, instances.length - 1);
    const selectedInstance = instances[randomIndex];
    return selectedInstance;
  }
}
