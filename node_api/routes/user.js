import express from 'express';
const userRouter= express.Router();
import { getUserprofile,updateUserprofile,bookAppointment,getUserAppointments,getUserNamebyId,cancelAppointment } from '../controllers/userControllers.js';

userRouter.get("/me",(req,res)=> {
    let user=req.user;
    if(!user || user.role!='user'){
        return res.status(400).json({
            status:'fail',
            message:'Not logged in'
        });
    }
    return res.status(200).json({
        status:'success',
        profile:{
            id:user.id,
            name:user.name,
            email:user.email, 
            role:user.role,   
        }
    });
    
});
userRouter.get("/profile/:uid",getUserprofile);
userRouter.patch("/updateProfile/:uid",updateUserprofile);
userRouter.post("/bookAppointment",bookAppointment);
userRouter.get("/appointments",getUserAppointments);
userRouter.get("/getName/:uid",getUserNamebyId);
userRouter.delete("/cancelAppointment/:aid",cancelAppointment);

export default userRouter;