import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";
import {
  getProfile,
  uploadAvatar,
  listUsersForSuperAdmin,
  updateUserStatus,
  deleteUserBySuperAdmin,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.post("/upload-avatar", protect, upload.single("profileImage"), uploadAvatar);
router.get("/admin/users", protect, authorize("super-admin"), listUsersForSuperAdmin);
router.patch("/admin/users/:id/status", protect, authorize("super-admin"), updateUserStatus);
router.delete("/admin/users/:id", protect, authorize("super-admin"), deleteUserBySuperAdmin);

export default router;
