import express from 'express';
import mongoose from 'mongoose';
import {config} from 'dotenv';
import morgan from 'morgan';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import doctorRouter from './routes/doctor.js';
import { checkRole, userAuth } from './middlewares/authMiddlewares.js';
const app=express();

config({path:'./config.env'});

if (process.env.NODE_ENV === 'production') {
    await mongoose.connect(process.env.DATABASE).then(()=>{
        console.log('Cloud Database connected');
    }).catch((err)=>{
        console.log(err);
    });    
}
else{
    await mongoose.connect(process.env.DATABASE_LOCAL).then(()=>{
        console.log('Local Database connected');
    }).catch((err)=>{
        console.log(err);
    });
}


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userAuth,userRouter); //No check here because doctor should be able to view user data.
app.use("/api/v1/doctors",userAuth,checkRole("doctor"),doctorRouter);

app.get('/',(req,res)=>{
    res.send('AetherWell api running');
});


const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});