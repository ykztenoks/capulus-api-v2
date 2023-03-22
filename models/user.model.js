import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: 4,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    passwordHash: { type: String, required: true },
    profileImg: { type: String },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      required: true,
    },
    likedCoffees: [{ type: Types.ObjectId, ref: "Coffee" }],
    isActive: { type: Boolean, default: true },
    createdCoffees: [{ type: Types.ObjectId, ref: "Coffee" }],
    reviews: [{ type: Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);

export default UserModel;
