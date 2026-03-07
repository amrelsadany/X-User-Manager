import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkmanager';
    
    await mongoose.connect(mongoUri, {
      // These options help with serverless cold starts
      bufferCommands: false,
      maxPoolSize: 1, // Limit connections in serverless
    });

    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
