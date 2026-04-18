import Item from "../models/Item.js";
import Match from "../models/Match.js";
import {
  compareItemsSimilarity,
  isStrongItemMatch,
} from "./itemSimilarityService.js";

const getPairIds = (itemA, itemB) => {
  const lostItem = itemA.itemType === "Lost" ? itemA : itemB;
  const foundItem = itemA.itemType === "Found" ? itemA : itemB;

  return {
    lostItemId: lostItem._id,
    foundItemId: foundItem._id,
  };
};

const itemHasConfirmedMatch = async (itemId) => {
  const confirmed = await Match.exists({
    status: "confirmed",
    $or: [{ lostItemId: itemId }, { foundItemId: itemId }],
  });

  return Boolean(confirmed);
};

const matchAlreadyExists = async (lostItemId, foundItemId) => {
  const existing = await Match.exists({ lostItemId, foundItemId });
  return Boolean(existing);
};

export const findMatchesForItem = async (approvedItemInput) => {
  const approvedItem =
    approvedItemInput instanceof Item
      ? approvedItemInput
      : await Item.findById(approvedItemInput);

  if (!approvedItem) {
    return [];
  }

  if (approvedItem.status !== "Approved") {
    return [];
  }

  if (await itemHasConfirmedMatch(approvedItem._id)) {
    return [];
  }

  const oppositeType = approvedItem.itemType === "Lost" ? "Found" : "Lost";

  const candidateItems = await Item.find({
    _id: { $ne: approvedItem._id },
    status: "Approved",
    itemType: oppositeType,
  }).lean();

  const createdMatches = [];

  for (const candidate of candidateItems) {
    if (await itemHasConfirmedMatch(candidate._id)) {
      continue;
    }

    const comparison = compareItemsSimilarity(approvedItem, candidate);
    if (!isStrongItemMatch(comparison)) {
      continue;
    }

    const { lostItemId, foundItemId } = getPairIds(approvedItem, candidate);

    if (await matchAlreadyExists(lostItemId, foundItemId)) {
      continue;
    }

    const created = await Match.create({
      lostItemId,
      foundItemId,
      status: "pending",
      adminMessage: null,
      score: comparison.score,
    });

    createdMatches.push(created);
  }

  return createdMatches;
};
