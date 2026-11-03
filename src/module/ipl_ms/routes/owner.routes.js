import { Router } from "express";
import * as controller from "../controllers/owner.controller.js";
import { authenticate } from "../../auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", controller.createOwner);
router.get("/", controller.getAllOwners);
router.get("/:id", controller.getOwnerById);
router.put("/:id", controller.updateOwner);
router.delete("/:id", controller.deleteOwner);

export default router;
