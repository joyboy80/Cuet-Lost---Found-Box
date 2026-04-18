import Notification from "../models/Notification.js";
import Item from "../models/Item.js";

const LOST_OWNER_MESSAGE =
  "Your lost item has been successfully matched with a found item.";
const FOUND_OWNER_MESSAGE =
  "Your found item has been successfully matched with a lost item.";

export const notifyUsersForConfirmedMatch = async (match) => {
  const [lostItem, foundItem] = await Promise.all([
    Item.findById(match.lostItemId).select("owner").lean(),
    Item.findById(match.foundItemId).select("owner").lean(),
  ]);

  const lostOwnerId = String(lostItem?.owner || "");
  const foundOwnerId = String(foundItem?.owner || "");

  if (!lostOwnerId && !foundOwnerId) {
    return [];
  }

  const notifications = [
    lostOwnerId
      ? {
          userId: lostOwnerId,
          matchId: match._id,
          message: LOST_OWNER_MESSAGE,
          type: "match_success",
          role: "lost_owner",
          isRead: false,
        }
      : null,
    foundOwnerId
      ? {
          userId: foundOwnerId,
          matchId: match._id,
          message: FOUND_OWNER_MESSAGE,
          type: "match_success",
          role: "found_owner",
          isRead: false,
        }
      : null,
  ].filter(Boolean);

  const created = [];
  for (const payload of notifications) {
    const doc = await Notification.findOneAndUpdate(
      {
        userId: payload.userId,
        matchId: payload.matchId,
        type: payload.type,
      },
      { $setOnInsert: payload },
      { new: true, upsert: true }
    );
    created.push(doc);
  }

  return created;
};
