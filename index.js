import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connect from "./config/db.config.js";
import userRouter from "./routes/user.routes.js";
import coffeeRouter from "./routes/coffee.routes.js";
import reviewRouter from "./routes/review.routes.js";

const app = express();

app.use(cors({ origin: "*" }));

dotenv.config();
connect();

app.use(express.json());

app.use(`/user`, userRouter);
app.use(`/coffees`, coffeeRouter);
app.use(`/reviews`, reviewRouter);

app.listen(Number(process.env.PORT), () => {
  console.clear();
  console.log(`Server up and running on port ${process.env.PORT}`);
});
