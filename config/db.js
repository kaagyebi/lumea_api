import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // The family: 4 option forces mongoose to use IPv4, which can prevent
    // connection issues on systems that default to IPv6.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
