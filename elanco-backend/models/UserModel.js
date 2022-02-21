import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
    
    
})


userSchema.methods.comparePassword =function(original,callback){
    return callback(null, bcrypt.compareSync(this.password,10))
}



export default mongoose.model("UserProfile", userSchema);