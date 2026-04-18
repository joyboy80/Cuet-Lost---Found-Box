import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getPendingMatches,
  confirmMatch,
  rejectMatch,
  notifyMatchUsers,
} from "../controllers/adminMatchController.js";

const router = express.Router();

router.get("/matches", protect, authorize("admin", "super-admin"), getPendingMatches);
router.put(
  "/match/confirm/:id",
  protect,
  authorize("admin", "super-admin"),
  confirmMatch
);
router.put(
  "/match/reject/:id",
  protect,
  authorize("admin", "super-admin"),
  rejectMatch
);
router.put(
  "/match/notify/:id",
  protect,
  authorize("admin", "super-admin"),
  notifyMatchUsers
);

export default router;
