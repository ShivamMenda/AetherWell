import express from 'express';
const doctorRouter= express.Router();
import { getDoctorprofile,getDoctorNamebyId,getDoctorAppointments,createDoctorAppointment,updateAppointmentStatus,cancelDoctorAppointment,updateDoctorAvailabilityById } from '../controllers/doctorControllers.js';

doctorRouter.get("/me",(req,res)=> {
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
doctorRouter.get("/appointments/",getDoctorAppointments);
doctorRouter.post("/createAppointment/:aid",createDoctorAppointment);
doctorRouter.put("/updateAppointmentStatus/:aid",updateAppointmentStatus);
doctorRouter.delete("/deleteAppointment/:aid",cancelDoctorAppointment);
doctorRouter.patch("/updateAvailability/:did",updateDoctorAvailabilityById);
export default doctorRouter;