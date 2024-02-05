import User from "../models/users.js";
import Doctor from "../models/doctors.js";
import Appointment from "../models/appointments.js";
import UserAppointment from "../models/userAppointments.js";
import DoctorAppointment from "../models/doctorAppointments.js";

export async function getUserprofile(req,res){
        /*
#swagger.tags = ['User']
*/
    try{
        let user= await User.findById(req.user.id);
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

export async function updateUserprofile(req,res){
            /*
#swagger.tags = ['User']
*/
    try{
        let user= await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({
                status:'fail',
                message:'User not found'
            });
        }
        user.name=req.body.name;
        user.email=req.body.email;
        user.age=req.body.age;
        user.address=req.body.address;
        user.phone=req.body.phone;
        await user.save();
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

export async function bookAppointment(req,res){
            /*
#swagger.tags = ['User']
*/
    try {
        let {doctorId,date,startTime,endTime}= req.body;
    let doctor= await Doctor.findById(doctorId);
    if(!doctor){
        return res.status(400).json({
            status:'fail',
            message:'Doctor not found'
        });
    };
    let temp_day= new Date(date.split('-').reverse().join('-')).toLocaleDateString('en-US', { weekday: 'long' });

    let dayAvailability= doctor.availability.find((day)=>{
        day.day==temp_day? true:false;
    })
    for (let day of doctor.availability) {
        for (let slot of day.slots) {
            slot.status='available'? dayAvailability=true:dayAvailability=false;
        }
    }
    if (dayAvailability===false ) {
        return res.status(400).json({
            status:'fail',
            message:'Doctor not available',
        });
    };
    let finalDate= new Date(date);
    let uid=req.user.id;
    let newAppointment={
        doctorId:doctorId,
        userId:uid,
        date:finalDate,
        startTime:startTime,
        endTime:endTime,
        status:'confirmed'
    };


    let app = await Appointment.create(newAppointment);
    if (!app) {
        return res.status(400).json({
            status:'fail',
            message:'Appointment not booked'
        });
    };

    let newAppointmentBooked= await Appointment.findById(app._id);
    if (!newAppointmentBooked) {
        return res.status(400).json({
            status:'fail',
            message:'Appointment not booked'
        });
        
    }
    let userApp= await UserAppointment.create({
        userId:uid,
        appointmentId:newAppointmentBooked._id, 
    });

    let doctorApp= await DoctorAppointment.create({
        doctorId:doctorId,
        appointmentId:newAppointmentBooked._id,
    });
    if (!userApp || !doctorApp) {
        return res.status(400).json({
            status:'fail',
            message:'Appointment not booked'
        });
    };
    for (let day of doctor.availability) {
        if (day.day==temp_day) {
            for (let slot of day.slots) {
                if (slot.start==startTime && slot.end==endTime) {
                    slot.status='booked';
                }
            }
        }
    }
    return res.status(200).json({
        status:'success',
        appointment: newAppointment,
    });
    
        
    } catch (error) {
        return res.status(500).json({
            status:'fail',
            message:error.message
        });
    }
    
}

export async function getUserAppointments(req,res){
            /*
#swagger.tags = ['User']
*/
    try {
    let uid=req.user.id;
    let userAppointments= await UserAppointment.find({userId:uid});
    if (!userAppointments) {
        return res.status(400).json({
            status:'fail',
            message:'No appointments found'
        });
    };
    let appointments=[];
    for (let userApp of userAppointments) {
        let appointment= await Appointment.findById(userApp.appointmentId);
        if (!appointment) {
            return res.status(400).json({
                status:'fail',
                message:'No appointments found'
            });
        };
        appointments.push(appointment);
    }
    return res.status(200).json({
        status:'success',
        appointments:appointments,
    });
        
    } catch (error) {
        return res.status(500).json({
            status:'fail',
            message:error.message
        });
    }
    
}

export async function getUserNamebyId(req,res) {
            /*
#swagger.tags = ['User']
*/
    try {
        let user= await User.findById(req.params.uid);
        if (!user) {
            return res.status(400).json({
                status:'fail',
                message:'User not found'
            });
        };
        return res.status(200).json({
            status:'success',
            name:user.name,
        });
    } catch (error) {
        
    }
};

export async function cancelAppointment(req,res) {
            /*
#swagger.tags = ['User']
*/
    let uid=req.user.id;
    let appointmentId=req.params.aid;
    let userAppointment= await UserAppointment.findOne({userId:uid,appointmentId:appointmentId});
    if (!userAppointment) {
        return res.status(400).json({
            status:'fail',
            message:'Appointment not found'
        });
    };
    let isUserCancelled= await UserAppointment.deleteOne({userId:uid,appointmentId:appointmentId});
    let isDoctorCancelled= await DoctorAppointment.deleteOne({appointmentId:appointmentId});
    let isAppCancelled= await Appointment.findByIdAndDelete(appointmentId);
    if (!isUserCancelled || !isDoctorCancelled || !isAppCancelled) {
        return res.status(400).json({
            status:'fail',
            message:'Appointment not cancelled'
        });
    };
    return res.status(200).json({
        status:'success',
        message:'Appointment cancelled successfully'
    });
}

export async function getAllDoctors(req,res){
            /*  #swagger.tags = ['User']
                #swagger.description = 'Get all doctors'
            */
    try {
        let doctors= await Doctor.find();
        if (!doctors) {
            return res.status(400).json({
                status:'fail',
                message:'No doctors found'
            });
        }
        else{
            return res.status(200).json({
                status:'success',
                doctors:doctors,
            });
        }
    } catch (error) {
        return res.status(500).json({
            status:'fail',
            message:error.message
        });
    }
}