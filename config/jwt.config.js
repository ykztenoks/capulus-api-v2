import jwt from "jsonwebtoken";

export default function generateToken(user) {
  const { _id, name, email, role } = user;

  const signature = process.env.TOKEN_SECRET;
  const expiration = "6h";

  return jwt.sign({ _id, name, email, role }, signature, {
    algorithm: "HS256",
    expiresIn: expiration,
  });
}

function generateRefreshToken(user) {
  const { _id } = user;

  const signature = process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = "7d";

  return jwt.sign({ _id }, signature, { expiresIn });
}
