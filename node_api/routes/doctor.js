import express from 'express';
const doctorRouter= express.Router();
import { getDoctorprofile,getDoctorNamebyId,getDoctorAppointments,updateAppointmentStatus,cancelDoctorAppointment,updateDoctorProfile,updateAvailabilityStatus,getAvailableSlots,getSlots } from '../controllers/doctorControllers.js';

doctorRouter.get("/me",(req,res)=> {
    /*
#swagger.tags = ['Doctor']
*/
    let doctor=req.user;
    if(!doctor || doctor.role!='doctor'){
        return res.status(400).json({
            status:'fail',
            message:'Not logged in'
        });
    }
    return res.status(200).json({
        status:'success',
        profile:{
            id:doctor.id,
            name:doctor.name,
            email:doctor.email, 
            role:doctor.role,   
        }
    });   
});
doctorRouter.get("/profile/:did",getDoctorprofile);
doctorRouter.get("/name/:did",getDoctorNamebyId);
doctorRouter.patch("/updateProfile/",updateDoctorProfile);
doctorRouter.get("/appointments/",getDoctorAppointments);
doctorRouter.put("/updateAppointmentStatus/:aid",updateAppointmentStatus);
doctorRouter.delete("/deleteAppointment/:aid",cancelDoctorAppointment);
doctorRouter.get("/getAvailableSlots/:did",getAvailableSlots);
doctorRouter.post("/getSlots/:did",getSlots);
doctorRouter.patch("/updateAvailabilityStatus/:did",updateAvailabilityStatus);
export default doctorRouter;