import { UserModel } from "../models/user.model.js";

export async function attachCurrentUser(req, res, next) {
  try {
    const loggedInUser = req.auth;
    console.log(loggedInUser);

    const user = await UserModel.findOne(
      { _id: loggedInUser._id },
      { passwordHash: 0 }
    );

    if (!user) {
      return res.status(400).json({ msg: "This user is not logged in" });
    }
    req.currentUser = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
