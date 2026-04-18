import User from "../models/User.js";
import Match from "../models/Match.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { uploadBufferToCloudinary } from "../services/cloudinaryService.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "name email department profileImage role systemRole status"
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      department: user.department || "",
      profileImage: user.profileImage || "",
      role: user.role,
      systemRole: user.systemRole,
      status: user.status,
    },
  });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Profile image file is required.");
  }

  const cloudinaryResult = await uploadBufferToCloudinary(
    req.file.buffer,
    "cuet-lost-found/avatars"
  );

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: cloudinaryResult.secure_url },
    { new: true, runValidators: true }
  ).select("profileImage");

  if (!updatedUser) {
    throw new ApiError(404, "User not found.");
  }

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully.",
    data: {
      profileImage: updatedUser.profileImage || "",
    },
  });
});

export const getUserProfile = getProfile;
export const updateProfileImage = uploadAvatar;

export const listUsersForSuperAdmin = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select("name email role systemRole studentID department status createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: users,
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "blocked"].includes(String(status || "").trim())) {
    throw new ApiError(400, "status must be active or blocked.");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (String(user._id) === String(req.user._id)) {
    throw new ApiError(400, "You cannot change your own status.");
  }

  user.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${status} successfully.`,
    data: {
      id: user._id,
      status: user.status,
    },
  });
});

export const deleteUserBySuperAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (String(user._id) === String(req.user._id)) {
    throw new ApiError(400, "You cannot delete your own account.");
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});

export const getSuccessfulPosts = asyncHandler(async (req, res) => {
  const currentUserId = String(req.user._id);

  const matches = await Match.find({ status: "confirmed" })
    .sort({ updatedAt: -1 })
    .populate({
      path: "lostItemId",
      populate: { path: "owner", select: "name email department phone" },
    })
    .populate({
      path: "foundItemId",
      populate: { path: "owner", select: "name email department phone" },
    })
    .lean();

  const notifications = await Notification.find({
    userId: req.user._id,
    type: "match_success",
  })
    .select("matchId message createdAt isRead")
    .lean();

  const notificationMap = new Map(
    notifications.map((notification) => [String(notification.matchId), notification])
  );

  const ownMatches = matches.filter((match) => {
    const lostOwnerId = String(match.lostItemId?.owner?._id || "");
    const foundOwnerId = String(match.foundItemId?.owner?._id || "");
    return lostOwnerId === currentUserId || foundOwnerId === currentUserId;
  });

  const data = ownMatches.map((match) => {
    const lostOwnerId = String(match.lostItemId?.owner?._id || "");
    const isLostOwner = lostOwnerId === currentUserId;
    const ownItem = isLostOwner ? match.lostItemId : match.foundItemId;
    const pairedItem = isLostOwner ? match.foundItemId : match.lostItemId;
    const notification = notificationMap.get(String(match._id));

    return {
      id: match._id,
      itemTitle: ownItem?.title || "Matched Item",
      itemImageUrl: ownItem?.imageUrl || "",
      ownItemType: ownItem?.itemType || "",
      pairedItemTitle: pairedItem?.title || "",
      pairedItemImageUrl: pairedItem?.imageUrl || "",
      pairedItemType: pairedItem?.itemType || "",
      otherUser: {
        name: pairedItem?.owner?.name || "",
        email: pairedItem?.owner?.email || "",
        department: pairedItem?.owner?.department || "",
        phone: pairedItem?.owner?.phone || "",
      },
      adminMessage:
        notification?.message ||
        match.adminMessage ||
        "Your lost item has been successfully matched with a found item.",
      matchDate: match.notifiedAt || notification?.createdAt || match.updatedAt || match.createdAt,
      notificationRead: Boolean(notification?.isRead),
      status: match.status,
    };
  });

  res.status(200).json({
    success: true,
    data,
  });
});
