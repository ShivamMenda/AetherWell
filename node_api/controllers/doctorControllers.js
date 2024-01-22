import Doctor from "../models/doctors.js";
import DoctorAppointment from "../models/doctorAppointments.js";
import Appointment from "../models/appointments.js";
import UserAppointment from "../models/userAppointments.js";

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

export async function getDoctorNamebyId(req,res){
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
    try {
        let doctorId=req.params.did;
        let availability=req.body.availability;
        await Doctor.findByIdAndUpdate(doctorId,{availability:availability}).then((doctor)=>{
            return res.status(200).json({
                status:'success',
                doctor:doctor,
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