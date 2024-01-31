import { Request, Response } from "express";
import { connect } from "../baileys/baileys";

export async function connectWpp(req: Request, res: Response) {
  try {
    await connect();
    return res.status(200).send("Connected");
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Interval server error");
  }
}
