import express from 'express';
const userRouter= express.Router();
import { getUserprofile,updateUserprofile,bookAppointment,getUserAppointments,getUserNamebyId,cancelAppointment,getAllDoctors } from '../controllers/userControllers.js';

userRouter.get("/meUser",(req,res)=> {
        /*
#swagger.tags = ['User']
*/
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
userRouter.get("/profile/",getUserprofile);
userRouter.patch("/updateProfile/",updateUserprofile);
userRouter.get("/getAllDoctors",getAllDoctors);
userRouter.post("/bookAppointment",bookAppointment);
userRouter.get("/appointments",getUserAppointments);
userRouter.get("/getName/:uid",getUserNamebyId);
userRouter.delete("/cancelAppointment/:aid",cancelAppointment);

export default userRouter;