import mongoose from 'mongoose'

export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DATABASE_URL!)
  console.log(`MongoDB connected: ${conn.connection.host}`)
}
