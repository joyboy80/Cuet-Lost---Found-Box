import express from "express";
import upload from "../utils/upload.js";
import {
	createItem,
	getAllItems,
	getUserItems,
	updateItemStatus,
} from "../controllers/itemController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/items/report
// Frontend should send multipart/form-data with these fields:
// - title (string)
// - description (string)
// - category (string)
// - type ("lost" or "found")
// - image (file input)
// Must include Authorization header: Bearer <JWT>
router.post("/report", protect, upload.single("image"), createItem);
router.get("/", protect, getAllItems);
router.get("/my-items", protect, getUserItems);

// Admin/Super Admin moderation routes.
router.patch(
	"/:id/status",
	protect,
	authorize("admin", "super-admin"),
	updateItemStatus
);

export default router;
