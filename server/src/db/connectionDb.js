import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const URI = process.env.MONGO_URI;

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = undefined;

  try {
    if (!URI) {
      throw new Error('MONGO_URI is not configured');
    }

    connectionPromise = mongoose.connect(URI);
    await connectionPromise;
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = undefined;
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};
export default connectDB;
