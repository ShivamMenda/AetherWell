import express from 'express';
const doctorRouter= express.Router();
import { getDoctorprofile,getDoctorNamebyId,getDoctorAppointments,createDoctorAppointment,updateAppointmentStatus } from '../controllers/doctorControllers.js';

doctorRouter.get("/profile/:did",getDoctorprofile);
doctorRouter.get("/name/:did",getDoctorNamebyId);
doctorRouter.get("/appointments/",getDoctorAppointments);
doctorRouter.post("/createAppointment/",createDoctorAppointment);
doctorRouter.put("/updateAppointmentStatus/:aid",updateAppointmentStatus);
export default doctorRouter;