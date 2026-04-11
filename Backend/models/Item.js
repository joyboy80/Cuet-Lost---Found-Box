import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    itemType: {
      type: String,
      enum: ["Lost", "Found"],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved"],
      default: "Pending",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

itemSchema.index({ status: 1, createdAt: -1 });
itemSchema.index({ itemType: 1, category: 1, createdAt: -1 });
itemSchema.index({ owner: 1, createdAt: -1 });

const Item = mongoose.model("Item", itemSchema);

export default Item;
