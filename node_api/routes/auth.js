import express from 'express';
const authRouter= express.Router();
import jwt from 'jsonwebtoken';
import { userSignup,userLogin } from '../controllers/authControllers.js';
// import { userAuth,checkRole } from '../middlewares/authMiddlewares.js';


authRouter.post("/doctors/login",(req,res)=>{
    /*
    #swagger.tags = ['Auth']
    */
    userLogin(req.body,'doctor',res);
});

authRouter.post("/users/login",(req,res)=>{
    /*
#swagger.tags = ['Auth']
*/
    userLogin(req.body,'user',res);
});

authRouter.post("/doctors/register",(req,res)=>{
    /*
#swagger.tags = ['Auth']
*/
    userSignup(req.body,'doctor',res);
});

authRouter.post("/users/register",(req,res)=>{
    /*
#swagger.tags = ['Auth']
*/
    userSignup(req.body,'user',res);
});

authRouter.post("/logout",(req,res)=>{
    /*
#swagger.tags = ['Auth']
*/
    res.clearCookie("token");
    return res.json({
        message:"Logged out successfully"
    });
});

// authRouter.get("/user-protected",userAuth,checkRole("user"),(req,res)=>{
//     return res.json(`welcome ${req.body.name}`);
// });

// authRouter.get("/doctor-protected",userAuth,checkRole("doctor"),(req,res)=>{
//     return res.json(`welcome ${req.body.name}`);
// });


export default authRouter;