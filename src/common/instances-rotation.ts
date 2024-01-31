import { sessions } from "../baileys/baileys";
import { NoInstancesConnectedError } from "../../errors/no-instances-connected-error";

export class InstancesRotation {
  private currentIndex: number = 0;

  getNextInstance() {
    const instances = Array.from(sessions.entries());
    if (instances.length <= 0) {
      throw new NoInstancesConnectedError();
    }
    if (this.currentIndex > instances.length) {
      this.currentIndex = 0;
    }
    const currentInstance = instances[this.currentIndex];
    this.currentIndex++;
    return {
      sessionId: currentInstance[0],
      socket: currentInstance[1],
    };
  }
}
