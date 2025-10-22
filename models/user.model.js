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
  wishList: {
    type: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    default: [],
  },
});

// TODO: add virtual review

export const userModel = mongoose.model("User", userSchema);

// user[old password] -> server
// server[key] -> [ok you can update]

// user[newPassword, confirm, key] -> server
