import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },
    foundItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
      index: true,
    },
    adminMessage: {
      type: String,
      default: null,
      trim: true,
    },
    notifiedAt: {
      type: Date,
      default: null,
      index: true,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ lostItemId: 1, foundItemId: 1 }, { unique: true });

const Match = mongoose.model("Match", matchSchema);

export default Match;
