import asyncHandler from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import Match from "../models/Match.js";
import { notifyUsersForConfirmedMatch } from "../services/notificationService.js";

const serializeItem = (item) => {
  if (!item) return null;

  return {
    id: item._id,
    title: item.title,
    description: item.description,
    category: item.category,
    location: item.location,
    itemType: item.itemType,
    status: item.status,
    imageUrl: item.imageUrl,
    owner: item.owner
      ? {
          id: item.owner._id,
          name: item.owner.name,
          email: item.owner.email,
          department: item.owner.department || "",
        }
      : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

const serializeMatch = (match) => ({
  id: match._id,
  lostItemId: match.lostItemId?._id || match.lostItemId,
  foundItemId: match.foundItemId?._id || match.foundItemId,
  lostItem: serializeItem(match.lostItemId?._id ? match.lostItemId : null),
  foundItem: serializeItem(match.foundItemId?._id ? match.foundItemId : null),
  status: match.status,
  adminMessage: match.adminMessage,
  notifiedAt: match.notifiedAt || null,
  score: match.score,
  createdAt: match.createdAt,
  updatedAt: match.updatedAt,
});

export const getPendingMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .populate({
      path: "lostItemId",
      populate: { path: "owner", select: "name email department" },
    })
    .populate({
      path: "foundItemId",
      populate: { path: "owner", select: "name email department" },
    })
    .lean();

  res.status(200).json({
    success: true,
    data: matches.map(serializeMatch),
  });
});

export const confirmMatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminMessage = String(req.body?.adminMessage || "").trim();

  const match = await Match.findById(id);
  if (!match) {
    throw new ApiError(404, "Match not found.");
  }

  if (match.notifiedAt) {
    throw new ApiError(400, "This match is locked after notify and cannot be edited.");
  }

  if (match.status === "rejected") {
    throw new ApiError(400, "Rejected match cannot be confirmed.");
  }

  const wasAlreadyConfirmed = match.status === "confirmed";

  if (!wasAlreadyConfirmed) {
    match.status = "confirmed";
  }
  match.adminMessage = adminMessage || null;
  await match.save();

  // Once a pair is confirmed, close all other pending suggestions touching either item.
  if (!wasAlreadyConfirmed) {
    await Match.updateMany(
      {
        _id: { $ne: match._id },
        status: "pending",
        $or: [
          { lostItemId: match.lostItemId },
          { foundItemId: match.foundItemId },
          { lostItemId: match.foundItemId },
          { foundItemId: match.lostItemId },
        ],
      },
      {
        $set: {
          status: "rejected",
          adminMessage: "Auto-rejected because another match was confirmed for this item.",
        },
      }
    );

    await notifyUsersForConfirmedMatch(match);
  }

  const populated = await Match.findById(match._id)
    .populate({
      path: "lostItemId",
      populate: { path: "owner", select: "name email department" },
    })
    .populate({
      path: "foundItemId",
      populate: { path: "owner", select: "name email department" },
    });

  res.status(200).json({
    success: true,
    message: "Match confirmed successfully.",
    data: serializeMatch(populated),
  });
});

export const rejectMatch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const match = await Match.findById(id);
  if (!match) {
    throw new ApiError(404, "Match not found.");
  }

  if (match.notifiedAt) {
    throw new ApiError(400, "This match is locked after notify and cannot be edited.");
  }

  if (match.status !== "rejected") {
    match.status = "rejected";
    await match.save();
  }

  const populated = await Match.findById(match._id)
    .populate({
      path: "lostItemId",
      populate: { path: "owner", select: "name email department" },
    })
    .populate({
      path: "foundItemId",
      populate: { path: "owner", select: "name email department" },
    });

  res.status(200).json({
    success: true,
    message: "Match rejected successfully.",
    data: serializeMatch(populated),
  });
});

export const notifyMatchUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminMessage = String(req.body?.adminMessage || "").trim();

  if (!adminMessage) {
    throw new ApiError(400, "adminMessage is required.");
  }

  const match = await Match.findById(id);
  if (!match) {
    throw new ApiError(404, "Match not found.");
  }

  if (match.notifiedAt) {
    throw new ApiError(400, "Users have already been notified for this match.");
  }

  if (match.status !== "pending") {
    throw new ApiError(400, "Only pending matches can be notified.");
  }

  match.status = "confirmed";
  match.adminMessage = adminMessage;
  match.notifiedAt = new Date();
  await match.save();

  // Lock related pending suggestions once a match is confirmed/notified.
  await Match.updateMany(
    {
      _id: { $ne: match._id },
      status: "pending",
      $or: [
        { lostItemId: match.lostItemId },
        { foundItemId: match.foundItemId },
        { lostItemId: match.foundItemId },
        { foundItemId: match.lostItemId },
      ],
    },
    {
      $set: {
        status: "rejected",
        adminMessage: "Auto-rejected because another match was confirmed for this item.",
      },
    }
  );

  await notifyUsersForConfirmedMatch(match);

  const populated = await Match.findById(match._id)
    .populate({
      path: "lostItemId",
      populate: { path: "owner", select: "name email department" },
    })
    .populate({
      path: "foundItemId",
      populate: { path: "owner", select: "name email department" },
    });

  res.status(200).json({
    success: true,
    message: "Users notified successfully.",
    data: serializeMatch(populated),
  });
});
