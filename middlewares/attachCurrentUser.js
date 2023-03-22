import UserModel from "../models/user.model.js";

export default async function attachCurrentUser(req, res, next) {
  try {
    const loggedInUser = req.auth;

    const user = await UserModel.findOne(
      { _id: loggedInUser._id },
      { passwordHash: 0 }
    );

    if (!user || user._doc.isActive === false) {
      return res.status(400).json({ msg: "not allowed 😡" });
    }
    req.currentUser = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
