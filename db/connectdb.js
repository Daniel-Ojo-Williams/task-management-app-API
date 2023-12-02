import mongoose from "mongoose";

export const connectdb = async(uri) => {
  await mongoose.connect(uri)
}