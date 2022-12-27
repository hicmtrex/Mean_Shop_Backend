import mongoose from 'mongoose';

const db = async () => {
  try {
    const connection = await mongoose
      .set('strictQuery', true)
      .connect(process.env.MONGO_URI || '');
    console.log(`🟢 Mongo db connected:`, connection.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default db;
