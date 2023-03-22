import bcrypt from "bcrypt";
import { Router } from "express";
import UserModel from "../models/user.model.js";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

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

    if (!user || user._doc.isActive === false) {
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

userRouter
  .route("/profile")
  .get(isAuth, attachCurrentUser, async (req, res) => {
    try {
      const user = req.currentUser;
      if (!user) {
        return res
          .status(400)
          .json({ msg: "you have to login to check your profile" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.json({ msg: `Profile error: ${error}` });
    }
  })
  .put(isAuth, attachCurrentUser, async (req, res) => {
    try {
      const user = req.currentUser;

      if (req.body.role || req.body.isActive || req.body._id) {
        return res
          .status(401)
          .json({ msg: "you can't change that silly boy :)" });
      }

      if (!user) {
        return res
          .status(400)
          .json({ msg: "you have to login to check your profile" });
      }
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { ...req.body },
        { runValidators: true, new: true }
      );

      delete updatedUser._doc.passwordHash;

      return res
        .status(200)
        .json({ msg: "your profile was updated! 🎊", updatedUser });
    } catch (error) {
      console.log(error);
    }
  })
  .delete(isAuth, attachCurrentUser, async (req, res) => {
    try {
      const deactivate = await UserModel.findOneAndUpdate(
        req.currentUser._id,
        { isActive: false },
        { new: true, runValidators: true }
      );
      console.log(deactivate);
      return res.status(200).json({
        msg: "your account was deactivated successfully :)",
      });
    } catch (error) {
      console.log(error);
    }
  });

export default userRouter;
