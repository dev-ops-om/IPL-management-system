import { Router } from "express";
import * as controller from "../controllers/player.controller.js";
import { authenticate } from "../../auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", controller.createPlayer);
router.get("/", controller.getAllPlayers);
router.get("/top", controller.getTopPlayers);
router.get("/top-wickets", controller.getTopPlayersByWickets);
router.get("/team/:teamId", controller.getPlayersByTeam);
router.get("/:id", controller.getPlayerById);
router.put("/:id", controller.updatePlayer);
router.patch("/:id/transfer", controller.transferPlayer);
router.patch("/:id/role", controller.updatePlayerRole);
router.delete("/:id", controller.deletePlayer);

export default router;
