import mongoose from "mongoose";

const userSchema=new mongoose.Schema({ 
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['user','doctor'],
        default:'user',
        required:true,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        
    },
    address:{
        type:String,
        trim:true,
    },
    phone:{
        type:String,
        trim:true,
    },
    
},{timestamps:true});

let User= mongoose.model('User',userSchema);

export default User;