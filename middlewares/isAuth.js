import { expressjwt } from "express-jwt";
import * as dotenv from "dotenv";

dotenv.config();
export default expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
});
