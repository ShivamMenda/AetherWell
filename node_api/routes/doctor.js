import express from 'express';
const doctorRouter= express.Router();
import { getDoctorprofile } from '../controllers/doctorControllers.js';

doctorRouter.get("/profile/:did",getDoctorprofile);

export default doctorRouter;