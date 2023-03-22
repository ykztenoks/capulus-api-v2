import mongoose from "mongoose";

export default async function connect() {
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`Connected to database: ${dbConnect.connection.name}`);
  } catch (error) {
    console.log(error);
  }
}
