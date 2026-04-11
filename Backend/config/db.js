import mongoose from "mongoose";

const connectWithURI = async (mongoURI, label) => {
  if (!mongoURI) {
    throw new Error(`${label} is not set.`);
  }

  await mongoose.connect(mongoURI, {
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 20),
    minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 2),
    serverSelectionTimeoutMS: Number(
      process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 5000
    ),
    socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000),
  });
};

const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI;
  const localURI = process.env.MONGO_URI_LOCAL;

  if (!primaryURI && !localURI) {
    throw new Error(
      "No database URI configured. Set MONGO_URI (Atlas) or MONGO_URI_LOCAL (local MongoDB)."
    );
  }

  if (primaryURI) {
    try {
      await connectWithURI(primaryURI, "MONGO_URI");
      console.log("MongoDB connected successfully using MONGO_URI.");
      return;
    } catch (primaryError) {
      console.error("Primary MongoDB connection failed:", primaryError.message);

      if (!localURI) {
        throw primaryError;
      }
    }
  }

  try {
    await mongoose.disconnect();
  } catch {
    // Ignore disconnect failures while retrying with local URI.
  }

  await connectWithURI(localURI, "MONGO_URI_LOCAL");
  console.log("MongoDB connected successfully using MONGO_URI_LOCAL.");
};

export const closeDBConnection = async () => {
  await mongoose.disconnect();
};

export default connectDB;
