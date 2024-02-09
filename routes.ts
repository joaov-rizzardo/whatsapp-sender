import { Router } from "express";
import { connectWpp } from "./src/controllers/connect-wpp";
import { MaturationController } from "./src/controllers/maturation-controller";
import { AutomationController } from "./src/controllers/automation-controller";

const router = Router();

router.get("/connect", connectWpp);
router.get("/maturation/start", MaturationController.start);
router.get("/maturation/pause", MaturationController.pause);
router.get("/maturation/stop", MaturationController.stop);
router.get("/automation/start", AutomationController.start);
router.get("/automation/pause", AutomationController.pause);
router.get("/automation/stop", AutomationController.stop);

export default router;
