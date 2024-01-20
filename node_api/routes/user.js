import express from 'express';
const userRouter= express.Router();
import { getUserprofile,updateUserprofile,bookAppointment,getUserAppointments } from '../controllers/userControllers.js';

userRouter.get("/profile/:uid",getUserprofile);
userRouter.patch("/updateProfile/:uid",updateUserprofile);
userRouter.post("/bookAppointment",bookAppointment);
userRouter.get("/appointments",getUserAppointments);

export default userRouter;