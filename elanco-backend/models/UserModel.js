import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  forename: {
    type: String,
  },
  surname: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },

  phone: {
    type: String,
  },
  pets: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("UserProfile", userSchema);
