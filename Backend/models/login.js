import mongoose from "mongoose";
const userLoginSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        match:/@/,
    },
    password:{
        type:Number,
        required:true,
        min:[8,"Password must be 8 character long"],
    },
});

const UserLogin=mongoose.model("UserLogin",userLoginSchema);
export default UserLogin;