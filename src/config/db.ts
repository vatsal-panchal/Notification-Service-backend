import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notification_service';
  await mongoose.connect(mongoURI);
  console.log('MongoDB connected successfully');
};
