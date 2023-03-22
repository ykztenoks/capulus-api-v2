import { Schema, model, Types } from "mongoose";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const countries = require("../countries.json");

const coffeeSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 48,
    trim: true,
    unique: true,
  },
  country: {
    type: String,

    enum: [...countries.countries].map((country) => country.name),
  },
  type: {
    type: String,
    required: true,
    enum: ["Arabica", "Robusta", " Excelsa", "Liberica"],
  },
  roastLvl: {
    type: String,
    required: true,
    enum: [
      "Light roast",
      "White roast",
      "Medium roast",
      "Medium dark roast",
      "Dark roast",
    ],
  },
  notes: { type: String, required: true, maxLength: 64 },
  scaScore: { type: Number, max: 100 },
  extraInfo: { type: String, maxLength: 244 },
  reviews: [{ type: Types.ObjectId, ref: "Reviews" }],
  likes: [{ type: Types.ObjectId, ref: "User" }],
  createdBy: { type: Types.ObjectId, ref: "User" },
});
const CoffeeModel = model("Coffee", coffeeSchema);
export default CoffeeModel;
