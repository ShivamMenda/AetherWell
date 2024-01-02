const express=require('express');
const app=express();
const port=process.env.PORT || 3000;

app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Health Rec api running');
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});