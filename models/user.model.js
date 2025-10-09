import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
  },
  phoneNumber: String,
  password: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  location: {
    long: Number,
    lat: Number,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

export const userModel = mongoose.model("User", userSchema);
