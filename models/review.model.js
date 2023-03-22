import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: "User" },
    comment: { type: String, maxLength: 444, trim: true, required: true },
    coffee: { type: Types.ObjectId, ref: "Coffee" },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = model("Review", reviewSchema);
export default ReviewModel;
