import Doctor from "../models/doctors.js";
import DoctorAppointment from "../models/doctorAppointments.js";
import Appointment from "../models/appointments.js";
import UserAppointment from "../models/userAppointments.js";

export async function getDoctorprofile(req,res){
        /*
#swagger.tags = ['Doctor']
*/
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
            specialization:doctor.specialization,
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

export async function updateDoctorProfile(req,res){
        /*
#swagger.tags = ['Doctor']
*/
    try{
        let doctor= await Doctor.findById(req.user.id);
        if(!doctor){
            return res.status(400).json({
                status:'fail',
                message:'Doctor not found'
            });
        }
        doctor.name=req.body.name;
        doctor.email=req.body.email;
        doctor.age=req.body.age;
        doctor.address=req.body.address;
        doctor.phone=req.body.phone;
        await doctor.save();
        return res.status(200).json({
            status:'success',
            profile:{
                name:doctor.name,
                email:doctor.email,
                role:doctor.role,
                age:doctor.age,
                address:doctor.address,
                phone:doctor.phone,
                createdAt:doctor.createdAt,
            }
        });
    }catch(err){
        return res.status(500).json({
            status:'fail',
            message:err.message
        });
    
};
};

export async function getDoctorNamebyId(req,res){
        /*
#swagger.tags = ['Doctor']
*/
    let doctor= Doctor.findById(req.params.did);
    if (!doctor) {
        return res.status(404).json({
            status:"fail",
            message:"Doctor not found",
        });
    }
    return res.status(200).json({
        status:"success",
        name: doctor.name,
    })
}

export async function getDoctorAppointments(req,res){
        /*
#swagger.tags = ['Doctor']
*/
    try{
        let doctor= await Doctor.findById(req.user.id);
        if(!doctor){
            return res.status(400).json({
                status:'fail',
                message:'Doctor not found'
            });
        }
        let doctorId=req.user.id;
        let doctorAppointments= await DoctorAppointment.find({doctorId:doctorId});
        if(!doctorAppointments){
            return res.status(400).json({
                status:'fail',
                message:'No appointments found'
            });
        }
        let appointments=[];
    for (let i = 0; i < doctorAppointments.length; i++) {
        let appointment= await Appointment.findById(doctorAppointments[i].doctorId);
        appointments.push(appointment);
    };
        return res.status(200).json({
            status:'success',
            appointments:appointments,
        });
    }catch(err){
        return res.status(500).json({
            status:'fail',
            message:err.message
        });
    }
}

export async function createDoctorAppointment(req,res){
        /*
#swagger.tags = ['Doctor']
*/
    try {
        let doctorId=req.user.id;
        let newAppointmentId=req.params.aid;
        await DoctorAppointment.create({
            doctorId,
            newAppointmentId,
        }).then((doctorAppointment)=>{
            return res.status(200).json({
                status:'success',
                doctorAppointment:doctorAppointment,
            });
        }).catch((err)=>{
            return res.status(500).json({
                status:'fail',
                message:err.message
            });
        });
    } catch (error) {
        return res.status(500).json({
            status:'fail',
            message:error.message
        });
    }
}

export async function updateAppointmentStatus(req,res){
        /*
#swagger.tags = ['Doctor']
*/
    try {
        let doctorId=req.user.id;
        let appointmentId=req.params.aid;
        let status=req.body.status;
        await DoctorAppointment.findOneAndUpdate({doctorId:doctorId,appointmentId:appointmentId},{status:status}).then((doctorAppointment)=>{
            return res.status(200).json({
                status:'success',
                doctorAppointment:doctorAppointment,
            });
        }).catch((err)=>{
            return res.status(500).json({
                status:'fail',
                message:err.message
            });
        });
    } catch (error) {
        return res.status(500).json({
            status:'fail',
            message:error.message
        });
    }
}

export async function cancelDoctorAppointment(req,res){
        /*
#swagger.tags = ['Doctor']
*/
    try {
        let doctorId=req.user.id;
        let appointmentId=req.params.aid;
        let isDeleted= await DoctorAppointment.findOneAndDelete({doctorId:doctorId,appointmentId:appointmentId}) && Appointment.findOneAndDelete({_id:appointmentId}) && UserAppointment.findOneAndDelete({appointmentId:appointmentId});
        let isCancelled= await DoctorAppointment.findOneAndUpdate({doctorId:doctorId,appointmentId:appointmentId},{status:"cancelled"});
        if(!isDeleted || !isCancelled){
            return res.status(400).json({
                status:'fail',
                message:'Appointment not cancelled'
            });
        }
        return res.status(200).json({
            status:'success',
            message:'Appointment cancelled successfully',
        });
    
    } catch (error) {
        return res.status(500).json({
            status:'fail',
            message:error.message
        });
    }
}

export async function updateDoctorAvailabilityById(req,res){
        /*
#swagger.tags = ['Doctor']
*/
    try {
        const { day, slot } = req.body;
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(404).json({
                status: 'fail',
                message: 'Doctor not found'
            });
        }

        const dayAvailability = doctor.availability.find(d => d.day === day);
        if (!dayAvailability) {
            return res.status(400).json({
                status: 'fail',
                message: `No availability set for ${day}`
            });
        }
        let s = dayAvailability.slots.find(s => s.start === slot.start && s.end === slot.end);
        if(s.status === 'available') {
        dayAvailability.slots.push(slot);
        }
        else{
            return res.status(400).json({
                status: 'fail',
                message: `Slot not available`
            });
        }
        await doctor.save();

        return res.status(200).json({
            status: 'success',
            message: 'Availability updated successfully'
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

export async function updateAvailabilityStatus(req,res){
        /*
#swagger.tags = ['Doctor']
*/
    try {
        const { day, slot } = req.body;
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(404).json({
                status: 'fail',
                message: 'Doctor not found'
            });
        }

        const dayAvailability = doctor.availability.find(d => d.day === day);
        if (!dayAvailability) {
            return res.status(400).json({
                status: 'fail',
                message: `No availability set for ${day}`
            });
        }
        let s = dayAvailability.slots.find(s => s.start === slot.start && s.end === slot.end);
        if(s.status === 'available') {
        s.status = 'booked';
        }
        else{
            return res.status(400).json({
                status: 'fail',
                message: `Slot not available`
            });
        }
        await doctor.save();

        return res.status(200).json({
            status: 'success',
            message: 'Availability updated successfully'
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};