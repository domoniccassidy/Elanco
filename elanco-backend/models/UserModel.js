import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  forename: {
    type: String,
    default:"",
  },
  surname: {
    type: String,
    default:""
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
    type: String,default:""
  },
  city: {
    type: String,default:""
  },
  state: {
    type: String,default:""
  },
  zip: {
    type: String,default:""
  },

  phone: {
    type: String,default:""
  },
  pets: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("UserProfile", userSchema);
