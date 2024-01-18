import User from "../models/users.js";

export async function getUserprofile(req,res){
    try{
        let user= await User.findById(req.params.uid);
        if(!user){
            return res.status(400).json({
                status:'fail',
                message:'User not found'
            });
        }
        return res.status(200).json({
            status:'success',
            profile:{
                name:user.name,
                email:user.email,
                role:user.role,
                age:user.age,
                address:user.address,
                phone:user.phone,
                createdAt:user.createdAt,
            }
        });
    }catch(err){
        return res.status(500).json({
            status:'fail',
            message:err.message
        });
    }
}