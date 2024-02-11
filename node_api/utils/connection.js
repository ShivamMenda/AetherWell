import express from 'express';
import mongoose from 'mongoose';
import {config} from 'dotenv';
config({path:'../config.env'});

export async function connectDB(){
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') {
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
}

