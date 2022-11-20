import mongoose from "mongoose";

export async function connect() {
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`Connected to database: ${process.env.MONGODB_URI}`);
  } catch (error) {
    console.log(error);
  }
}
