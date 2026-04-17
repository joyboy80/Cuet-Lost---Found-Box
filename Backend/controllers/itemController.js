import Item from "../models/Item.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { uploadBufferToCloudinary } from "../services/cloudinaryService.js";

const normalizeItemType = (value = "") => {
  const lowered = String(value).trim().toLowerCase();
  if (lowered === "lost") return "Lost";
  if (lowered === "found") return "Found";
  return null;
};

const sanitizeItem = (itemDoc) => ({
  id: itemDoc._id,
  title: itemDoc.title,
  description: itemDoc.description,
  category: itemDoc.category,
  location: itemDoc.location,
  itemType: itemDoc.itemType,
  imageUrl: itemDoc.imageUrl,
  status: itemDoc.status,
  rejectionReason: itemDoc.rejectionReason || "",
  owner: itemDoc.owner
    ? {
        id: itemDoc.owner._id,
        name: itemDoc.owner.name,
        email: itemDoc.owner.email,
        department: itemDoc.owner.department || "",
      }
    : null,
  createdAt: itemDoc.createdAt,
  updatedAt: itemDoc.updatedAt,
});

export const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, location, itemType } = req.body;

  if (!title || !description || !category || !location || !itemType) {
    throw new ApiError(400, "title, description, category, location, and itemType are required.");
  }

  const normalizedType = normalizeItemType(itemType);
  if (!normalizedType) {
    throw new ApiError(400, "itemType must be either 'Lost' or 'Found'.");
  }

  if (!req.file) {
    throw new ApiError(400, "Image file is required in field 'image'.");
  }

  const cloudinaryResult = await uploadBufferToCloudinary(
    req.file.buffer,
    "cuet-lost-found/items"
  );

  const created = await Item.create({
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    location: location.trim(),
    itemType: normalizedType,
    imageUrl: cloudinaryResult.secure_url,
    status: "Pending",
    owner: req.user._id,
  });

  const populated = await Item.findById(created._id)
    .populate("owner", "name email department")
    .lean();

  res.status(201).json({
    success: true,
    message: "Item reported successfully.",
    data: sanitizeItem(populated),
  });
});

export const getAllItems = asyncHandler(async (req, res) => {
  const { itemType, category, status } = req.query;

  const query = {};

  const effectiveRole = req.user?.systemRole || req.user?.role || "user";
  const canModerateItems = ["admin", "super-admin"].includes(effectiveRole);

  if (!canModerateItems) {
    query.status = "Approved";
  } else if (status) {
    const normalizedStatus = String(status).trim().toLowerCase();
    const statusMap = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
    };

    if (!statusMap[normalizedStatus]) {
      throw new ApiError(400, "status filter must be Pending, Approved, or Rejected.");
    }

    query.status = statusMap[normalizedStatus];
  }

  if (itemType) {
    const normalizedType = normalizeItemType(itemType);
    if (!normalizedType) {
      throw new ApiError(400, "itemType filter must be 'Lost' or 'Found'.");
    }
    query.itemType = normalizedType;
  }

  if (category) {
    query.category = String(category).trim();
  }

  const items = await Item.find(query)
    .sort({ createdAt: -1 })
    .populate("owner", "name email department")
    .lean();

  res.status(200).json({
    success: true,
    data: items.map(sanitizeItem),
  });
});

export const getUserItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ owner: req.user._id, status: "Approved" })
    .sort({ createdAt: -1 })
    .populate("owner", "name email department")
    .lean();

  res.status(200).json({
    success: true,
    data: items.map(sanitizeItem),
  });
});

export const updateItemStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  const normalizedStatus = String(status || "").trim().toLowerCase();
  const statusMap = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };
  const nextStatus = statusMap[normalizedStatus] || null;

  if (!nextStatus) {
    throw new ApiError(400, "status must be Pending, Approved, or Rejected.");
  }

  const item = await Item.findById(id).populate("owner", "name email department");

  if (!item) {
    throw new ApiError(404, "Item not found.");
  }

  item.status = nextStatus;
  if (nextStatus === "Rejected") {
    item.rejectionReason = String(rejectionReason || "").trim();
  } else {
    item.rejectionReason = "";
  }
  await item.save();

  res.status(200).json({
    success: true,
    message: `Item status updated to ${nextStatus}.`,
    data: sanitizeItem(item.toObject()),
  });
});

export const reportItem = createItem;
