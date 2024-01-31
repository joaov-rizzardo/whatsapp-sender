import { Request, Response } from "express";
import { StartAutomationAction } from "../actions/start-automation-action";

export async function startAutomation(req: Request, res: Response) {
  try {
    await new StartAutomationAction().execute();
    return res.status(200).send("OK");
  } catch (error) {
    console.log(error);
  }
}
