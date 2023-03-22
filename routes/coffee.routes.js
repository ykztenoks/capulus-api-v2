import CoffeeModel from "../models/coffee.model.js";
import UserModel from "../models/user.model.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";
import { Router } from "express";

const coffeeRouter = Router();

coffeeRouter.get("/all", async (req, res) => {
  //all coffees
  try {
    const allCoffees = await CoffeeModel.find();
    return res.status(200).json(allCoffees);
  } catch (error) {
    return res.status(400).json(error);
  }
});

coffeeRouter
  .route("/:id")

  //specific coffee
  .get(async (req, res) => {
    try {
      const coffee = await CoffeeModel.findById(req.params.id);
      return res.status(200).json(coffee);
    } catch (error) {
      return res.status(400).json(error);
    }
  })

  //edit
  .put(isAuth, attachCurrentUser, async (req, res) => {
    try {
      const { id } = req.params;

      const coffee = await CoffeeModel.findById(id);
      if (String(coffee.createdBy) === String(req.currentUser._id)) {
        const updateCoffee = await CoffeeModel.findByIdAndUpdate(
          req.params.id,
          { ...req.body },
          { new: true, runValidators: true }
        );

        return res
          .status(200)
          .json({ msg: "updated successfully", updateCoffee });
      } else {
        return res.status(401).json({ msg: " something went wrong" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  })

  //like coffee
  .put(isAuth, attachCurrentUser, async (req, res) => {
    const coffee = await CoffeeModel.findById(req.params.id);
    const user = await UserModel.findById(req.currentUser._id);
    if (coffee && !user.likedCoffees.includes(String(coffee._id)))
      try {
        await UserModel.findByIdAndUpdate(user._id, {
          $push: { likedCoffees: coffee._id },
        });
        await CoffeeModel.findByIdAndUpdate(
          coffee._id,
          {
            $push: { likes: user._id },
          },
          { new: true, runValidators: true }
        );
      } catch (error) {
        console.log(error);
        return res.status(500).json(error);
      }
  })

  // delete
  .delete(isAuth, attachCurrentUser, async (req, res) => {
    try {
      const coffee = await CoffeeModel.findById(req.params.id);

      if (String(req.currentUser._id) === String(coffee.createdBy)) {
        await UserModel.findByIdAndUpdate(
          req.currentUser._id,
          { $pull: { createdCoffees: coffee._id } },
          { new: true, runValidators: true }
        );

        await CoffeeModel.deleteOne(coffee);

        return res.status(200).json({ msg: "deleted successfully! :)" });
      } else {
        return res.status(401).json({ msg: "unauthorized" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  });

//create
coffeeRouter.post("/create", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const newCoffee = await CoffeeModel.create({
      ...req.body,
      createdBy: req.currentUser._id,
    });

    await UserModel.findByIdAndUpdate(
      req.currentUser._id,
      { $push: { createdCoffees: newCoffee._id } },
      { new: true, runValidators: true }
    );

    return res
      .status(201)
      .json({ msg: "the coffee was added to our database! :)", newCoffee });
  } catch (error) {
    return res.status(400).json(error);
  }
});

export default coffeeRouter;
