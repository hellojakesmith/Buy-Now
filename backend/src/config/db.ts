import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production",
  });
}
