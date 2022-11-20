import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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
  createdAt: { type: Date },
});

const UserModel = model("User", userSchema);

export { UserModel };
