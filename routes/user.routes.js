import { Router } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { generateToken } from "../config/jwt.config.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { attachCurrentUser } from "../middlewares/attachCurrentUser.js";
import mongoose from "mongoose";

const SALT_ROUNDS = 10;

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid email or password, verify your input" });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    delete createdUser._doc.passwordHash;

    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token: token,
      });
    } else {
      return res
        .status(400)
        .json({ msg: "Invalid email/username/password. Please verify." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
export default userRouter;
