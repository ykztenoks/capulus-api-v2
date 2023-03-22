import CoffeeModel from "../models/coffee.model.js";
import UserModel from "../models/user.model.js";
import ReviewModel from "../models/review.model.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter
  .route("/:coffeeId")
  .post(isAuth, attachCurrentUser, async (req, res) => {
    try {
      const { coffeeId } = req.params;

      const review = await ReviewModel.create({
        ...req.body,
        coffee: coffeeId,
        author: req.currentUser._id,
      });

      await UserModel.findByIdAndUpdate(
        req.currentUser._id,
        { $push: { reviews: review._id } },
        { new: true, runValidators: true }
      );

      await CoffeeModel.findByIdAndUpdate(
        coffeeId,
        { $push: { reviews: review._id } },
        { new: true, runValidators: true }
      );

      return res.status(201).json({ msg: "review created!", review });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  })
  .delete(isAuth, attachCurrentUser, async (req, res) => {
    try {
      const review = await ReviewModel.findById(req.body.reviewId);
      console.log(review.author, req.currentUser._id);
      if (String(review.author) === String(req.currentUser._id)) {
        await UserModel.findByIdAndUpdate(
          req.currentUser._id,
          { $pull: { reviews: req.body.reviewId } },
          { new: true, runValidators: true }
        );
        await CoffeeModel.findByIdAndUpdate(
          req.params.coffeeId,
          {
            $pull: { reviews: review._id },
          },
          { new: true }
        );
        await ReviewModel.deleteOne(review);
        return res.status(200).json({ msg: "review deleted!" });
      } else {
        return res.status(401).json({ msg: "unauthorized" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

export default reviewRouter;
