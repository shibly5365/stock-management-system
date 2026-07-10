import mongoose from "mongoose";
const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MoongoDB is Connected");
  } catch (error) {
    console.error("Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};
export default connectDB;
