import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error("MONGODB_URI не указан в .env")
    }

    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`)
  } catch (err) {
    console.error("❌ Ошибка подключения к MongoDB Atlas:", err)
    process.exit(1)
  }
}

export default connectDB
