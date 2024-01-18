import express from 'express';
const authRouter= express.Router();
import { userSignup,userLogin } from '../controllers/authControllers.js';
import { userAuth,checkRole } from '../middlewares/authMiddlewares.js';


authRouter.post("/login-doctor",(req,res)=>{
    userLogin(req.body,'doctor',res);
});

authRouter.post("/login-user",(req,res)=>{
    userLogin(req.body,'user',res);
});

authRouter.post("/register-doctor",(req,res)=>{
    userSignup(req.body,'doctor',res);
});

authRouter.post("/register-user",(req,res)=>{
    userSignup(req.body,'user',res);
});

authRouter.get("/user-protected",userAuth,checkRole("user"),(req,res)=>{
    return res.json(`welcome ${req.body.name}`);
});

authRouter.get("/doctor-protected",userAuth,checkRole("doctor"),(req,res)=>{
    return res.json(`welcome ${req.body.name}`);
});

export default authRouter;