import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "shopper"],
      default: "shopper",
    },
  },
  {
    timestamps: true,
  },
);
const Users = mongoose.model("Users", usersSchema);
export default Users;
