import express from 'express';
import {config} from 'dotenv';
import morgan from 'morgan';
import { collectDefaultMetrics,Registry } from 'prom-client';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import doctorRouter from './routes/doctor.js';
import { checkRole, userAuth } from './middlewares/authMiddlewares.js';
import swagger from 'swagger-ui-express'; 
import data from './docs/swagger_output.json' assert { type: "json" };
import {connectDB} from './utils/connection.js';
import { rateLimiterMiddleware } from './middlewares/rateLimiter.js';
import cors from 'cors';
const app=express();
app.use(cors()); 

config({path:'./config.env'});

await connectDB();
const register= new Registry()
register.setDefaultLabels({
    app: 'aetherwell-api'
});
collectDefaultMetrics({register:register});

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
    app.use(morgan('dev'));
}


app.use(express.json());
app.use("/api-docs", swagger.serve, swagger.setup(data));
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userAuth,rateLimiterMiddleware,userRouter); 
app.use("/api/v1/doctors",userAuth,rateLimiterMiddleware,doctorRouter);

app.get('/',(req,res)=>{
    res.status(200).send('AetherWell api running');
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    register.metrics().then(metrics => {
        res.status(200).send(metrics);
    });
}
);

app.get('/api/v1/',(req,res)=>{
    res.json({
        status: "success",
        message:"AetherWell api running"
    })
});


const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});