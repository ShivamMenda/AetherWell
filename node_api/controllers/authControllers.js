import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import User from "../models/users.js";
import Doctor from "../models/doctors.js";
config();
export async function userSignup(req, role, res) {
    try {
        const validUsername= async(name)=>{
            if(role==='doctor'){
                let doctor= await Doctor.findOne({name});
                return doctor?false:true;
            }else{
                let user= await User.findOne({name});
                return user?false:true;
            }
        };
    //Get user from database with same email if any
    const validateEmail = async (email) => {
        if (role=="doctor") {
            let doctor = await Doctor.findOne({ email });
            return doctor ? false : true;
        }
        else{
        let user = await User.findOne({ email });
        return user ? false : true;
        }
      };
      // Validate the name
      let nameNotTaken = await validUsername(req.name);
      if (!nameNotTaken) {
        return res.status(400).json({
          message: `User name is already taken.`,
        });
      }
  
      // validate the email
      let emailNotRegistered = await validateEmail(req.email);
      if (!emailNotRegistered) {
        return res.status(400).json({
          message: `Email is already registered.`,
        });
      };
      const password= await bcrypt.hash(req.password,12);
      if (role==='doctor') {
        const newDoctor= new Doctor({
            ...req,
            password,
            role
        });
        await newDoctor.save();
        return res.status(201).json({
            status:'success',
            message:'Doctor created successfully',
        });
        
      }
      else{
        const newUser= new User({
            ...req,
            password,
            role
        });
        await newUser.save();
        return res.status(201).json({
            status:'success',
            message:'User created successfully',
        });
    }
    } catch (error) {
        return res.status(500).json({
            status:'error',
            message:error.message,
        });
        
    }
}

export async function userLogin(req,role,res) {

  let { name, password } = req;
    if (role=="doctor") {
        const doctor=await Doctor.findOne({name});
        if (!doctor) {
            return res.status(404).json({
                message:'Doctor name is not found. Invalid login credentials.',
                success:false
            });
        }
        let isMatch= await bcrypt.compare(password,doctor.password);
        if (isMatch) {
            let token= jwt.sign({
                role:doctor.role,
                name:doctor.name,
                email:doctor.email,
            },process.env.APP_SECRET,{expiresIn:'3 days'});
            let result={
                name:doctor.name,
                role:doctor.role,
                email:doctor.email,
                token:`Bearer ${token}`,
                expiresIn:168,
            };
            return res.status(200).json({
                ...result,
                message:'You are now logged in.',
            });
        }
        else{
            return res.status(403).json({
                message:'Incorrect password.',
            });
        }
    }
    else {
  const user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({
      message: "User name is not found. Invalid login credentials.",
      success: false,
    });
  }
  // We will check the if the user is logging in via the route for his departemnt
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false,
    });
  }

  // That means the user is existing and trying to signin fro the right portal
  // Now check if the password match
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // if the password match Sign a the token and issue it to the user
    let token = jwt.sign(
      {
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.APP_SECRET,
      { expiresIn: "3 days" }
    );

    let result = {
      name: user.name,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: "You are now logged in.",
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
    });
  }
}
};
