import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  forename: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
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
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
phone:{
    type:String,
    
}
});

userSchema.methods.comparePassword = function (original, callback) {
  return callback(null, bcrypt.compareSync(this.password, 10));
};

export default mongoose.model("UserProfile", userSchema);
