import { UserModel } from "../models/user.model.js";

export function isAdmin(req, res, next) {
  try {
    const loggedInUser = req.auth;

    if (loggedInUser.role !== "ADMIN") {
      return res.status(400).json({ msg: "Not authorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
