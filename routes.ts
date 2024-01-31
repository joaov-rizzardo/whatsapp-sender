import { Router } from "express";
import { connectWpp } from "./src/controllers/connect-wpp";
import { startAutomation } from "./src/controllers/start-automation";

const router = Router();

router.get("/connect", connectWpp);
router.get("/start", startAutomation);

export default router;
