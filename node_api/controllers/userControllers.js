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

export async function updateUserprofile(req,res){
            /*
#swagger.tags = ['User']
*/
    try{
        let user= await User.findById(req.params.uid);
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
    const dayAvailability= doctor.availability.find((availability)=>availability.day===date.getDay());
    if (!dayAvailability) {
        return res.status(400).json({
            status:'fail',
            message:'Doctor not available on this day'
        });
        
    };
    const requestedSlot = { start: startTime, end: endTime };
    const isSlotAvailable = dayAvailability.slots.some((slot) => {
        return slot.start <= requestedSlot.end && slot.end >= requestedSlot.start;
      });
    if (!isSlotAvailable) {
        return res.status(400).json({
            status:'fail',
            message:'Slot not available'
        });
    };
    // const bookedSlot = dayAvailability.slots.find((slot) => {
    //     return slot.start === requestedSlot.start && slot.end === requestedSlot.end;
    //   });
    const finalDate= new Date(date);
    let uid=req.user.id;
    let newAppointment={
        doctorId,
        uid,
        finalDate,
    };


    await Appointment.create(newAppointment).then((appointment)=>{
        return res.status(200).json({
            status:'success',
            appointment: appointment,

        });
    }).catch((err)=>{
        return res.status(500).json({
            status:'fail',
            message:err.message
        });
    });

    let newAppointmentBooked=Appointment.findOne(newAppointment);
    let newAppointmentId=newAppointmentBooked._id;
    if (!newAppointmentBooked) {
        return res.status(400).json({
            status:'fail',
            message:'Appointment not booked'
        });
        
    }
    await UserAppointment.create({
        uid,
        newAppointmentId, 
    }).then((userAppointment)=>{
        return res.status(200).json({
            status:'success',
            userAppointment:userAppointment,
        });
    }).catch((err)=>{
        return res.status(500).json({
            status:'fail',
            message:err.message
        });
    });

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

export async function getUserAppointments(req,res){
            /*
#swagger.tags = ['User']
*/
    try {
    let uid=req.user.id;
    let userAppointments= await UserAppointment.find({uid});
    if (!userAppointments) {
        return res.status(400).json({
            status:'fail',
            message:'No appointments found'
        });
    };
    let appointments=[];
    for (let i = 0; i < userAppointments.length; i++) {
        let appointment= await Appointment.findById(userAppointments[i].userId);
        appointments.push(appointment);
    };
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
    let userAppointment= await UserAppointment.findOne({uid,appointmentId});
    if (!userAppointment) {
        return res.status(400).json({
            status:'fail',
            message:'Appointment not found'
        });
    };
    let isUserCancelled= await UserAppointment.deleteOne({uid,appointmentId});
    let isDoctorCancelled= await DoctorAppointment.deleteOne({appointmentId});
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