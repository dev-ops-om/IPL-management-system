import { Router } from "express";
import * as controller from "../controllers/sponsor.controller.js";
import { authenticate } from "../../auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", controller.createSponsor);
router.get("/", controller.getAllSponsors);
router.get("/:id", controller.getSponsorById);
router.put("/:id", controller.updateSponsor);
router.delete("/:id", controller.deleteSponsor);

export default router;
