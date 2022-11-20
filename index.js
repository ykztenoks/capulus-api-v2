import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { connect } from "./config/db.config.js";
import userRouter from "./routes/user.routes.js";
const app = express();

app.use(cors({ origin: "*" }));

dotenv.config();
connect();

app.use(express.json());

app.use(`/user`, userRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server up and running on port ${process.env.PORT}`);
});
