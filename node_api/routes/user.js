import express from 'express';
const userRouter= express.Router();
import { getUserprofile } from '../controllers/userControllers.js';

userRouter.get("/profile/:uid",getUserprofile);

export default userRouter;