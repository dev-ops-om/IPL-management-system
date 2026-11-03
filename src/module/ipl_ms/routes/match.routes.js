import { Router } from "express";
import * as controller from "../controllers/match.controller.js";
import { authenticate } from "../../auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", controller.createMatch);
router.get("/", controller.getAllMatches);
router.get("/schedule", controller.getMatchSchedule);
router.get("/team/:teamId", controller.getMatchesByTeam);
router.get("/:id", controller.getMatchById);
router.put("/:id", controller.updateMatch);
router.patch("/:id/result", controller.saveMatchResult);
router.delete("/:id", controller.deleteMatch);

export default router;
