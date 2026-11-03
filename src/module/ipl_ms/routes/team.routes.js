import { Router } from "express";
import * as controller from "../controllers/team.controller.js";
import { authenticate } from "../../auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", controller.createTeam);
router.get("/", controller.getAllTeams);
router.get("/:id", controller.getTeamById);
router.put("/:id", controller.updateTeam);
router.delete("/:id", controller.deleteTeam);

router.get("/:id/players", controller.getTeamPlayers);

router.post("/:id/sponsors", controller.attachSponsor);
router.get("/:id/sponsors", controller.getTeamSponsors);
router.delete("/:id/sponsors/:sponsorId", controller.detachSponsor);

router.post("/:id/broadcasters", controller.assignBroadcaster);
router.get("/:id/broadcasters", controller.getTeamBroadcasters);
router.delete(
  "/:id/broadcasters/:broadcasterId",
  controller.unassignBroadcaster,
);

export default router;
