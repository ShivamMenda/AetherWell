import express from 'express';
import mongoose from 'mongoose';
import {config} from 'dotenv';
import morgan from 'morgan';
const app=express();

config({path:'./config.env'});

let db= async()=>{
    await mongoose.connect(process.env.DATABASE).then(()=>{
        console.log('Database connected');
    }).catch((err)=>{
        console.log(err);
    });
}
db();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());


app.get('/',(req,res)=>{
    res.send('AetherWell api running');
});

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});