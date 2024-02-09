import { Request, Response } from "express";
import { MaturationAlreadyRunningError } from "../../errors/maturation-already-running-error";
import {
  StartMaturationAction,
  maturationStatus,
  setMaturationStatus,
} from "../actions/start-maturation-action";

export class MaturationController {
  static start(req: Request, res: Response) {
    try {
      if (maturationStatus === "running") {
        throw new MaturationAlreadyRunningError();
      }
      setMaturationStatus("running");
      const startMaturation = new StartMaturationAction();
      startMaturation.execute();
      return res.status(200).send("OK");
    } catch (error: any) {
      setMaturationStatus("stopped");
      return res.status(500).send(error.message);
    }
  }

  static pause(req: Request, res: Response) {
    try {
      setMaturationStatus("paused");
      return res.status(200).send("OK");
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }

  static stop(req: Request, res: Response) {
    try {
      setMaturationStatus("stopped");
      return res.status(200).send("OK");
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }
}
