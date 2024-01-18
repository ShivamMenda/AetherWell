import Doctor from "../models/doctors.js";

export async function getDoctorprofile(req,res){
    try{
        let doctor= await Doctor.findById(req.params.did);
        if(!doctor){
            return res.status(400).json({
                status:'fail',
                message:'Doctor not found'
            });
        }
        const finalDoctor={
            name:doctor.name,
            email:doctor.email,
            role:doctor.role,
            age:doctor.age,
            address:doctor.address,
            phone:doctor.phone,
            createdAt:doctor.createdAt,
        };
        return res.status(200).json({
            status:'success',
            profile:finalDoctor,
        });
    }catch(err){
        return res.status(500).json({
            status:'fail',
            message:err.message
        });
    }
}