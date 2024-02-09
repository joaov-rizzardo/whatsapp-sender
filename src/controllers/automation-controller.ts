import { Request, Response } from "express";
import {
  StartAutomationAction,
  automationStatus,
  setAutomationStatus,
} from "../actions/start-automation-action";

export class AutomationController {
  static start(req: Request, res: Response) {
    try {
      if (automationStatus === "running") {
        console.log("[ENVIOS] O processo já está sendo executado");
        return res.status(204);
      }
      setAutomationStatus("running");
      const startMaturation = new StartAutomationAction();
      startMaturation.execute();
      return res.status(200).send("OK");
    } catch (error: any) {
      setAutomationStatus("stopped");
      return res.status(500).send(error.message);
    }
  }

  static pause(req: Request, res: Response) {
    try {
      setAutomationStatus("paused");
      return res.status(200).send("OK");
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }

  static stop(req: Request, res: Response) {
    try {
      setAutomationStatus("stopped");
      return res.status(200).send("OK");
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }
}
