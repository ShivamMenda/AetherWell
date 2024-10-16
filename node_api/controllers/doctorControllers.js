import Doctor from "../models/doctors.js";
import DoctorAppointment from "../models/doctorAppointments.js";
import Appointment from "../models/appointments.js";
import UserAppointment from "../models/userAppointments.js";
import mongoose from "mongoose";

export async function getDoctorprofile(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  try {
    let doctor = await Doctor.findById(req.params.did);
    if (!doctor) {
      return res.status(400).json({
        status: "fail",
        message: "Doctor not found",
      });
    }
    const finalDoctor = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      username: doctor.username,
      role: doctor.role,
      age: doctor.age,
      address: doctor.address,
      phone: doctor.phone,
      gender: doctor.gender,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      createdAt: doctor.createdAt,
    };
    return res.status(200).json({
      status: "success",
      profile: finalDoctor,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}

export async function updateDoctorProfile(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  try {
    let doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(400).json({
        status: "fail",
        message: "Doctor not found",
      });
    }
    doctor.name = req.body.name;
    doctor.email = req.body.email;
    doctor.age = req.body.age;
    doctor.address = req.body.address;
    doctor.phone = req.body.phone;
    doctor.gender = req.body.gender;
    doctor.specialization = req.body.specialization;
    doctor.hospital = req.body.hospital;
    doctor.username = req.body.username;
    await doctor.save();
    return res.status(200).json({
      status: "success",
      profile: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        username: doctor.username,
        role: doctor.role,
        age: doctor.age,
        address: doctor.address,
        phone: doctor.phone,
        specialization: doctor.specialization,
        gender: doctor.gender,
        hospital: doctor.hospital,
        createdAt: doctor.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}

export async function getDoctorNamebyId(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  let doctor = Doctor.findById(req.params.did);
  if (!doctor) {
    return res.status(404).json({
      status: "fail",
      message: "Doctor not found",
    });
  }
  return res.status(200).json({
    status: "success",
    name: doctor.name,
  });
}

export async function getDoctorAppointments(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  try {
    let doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(400).json({
        status: "fail",
        message: "Doctor not found",
      });
    }
    let doctorId = req.user.id;
    // let doctorAppointments = await DoctorAppointment.find({
    //   doctorId: doctorId,
    // });
    // if (!doctorAppointments) {
    //   return res.status(400).json({
    //     status: "fail",
    //     message: "No appointments found",
    //   });
    // }
    // let appointments = [];
    // for (let doctorApp of doctorAppointments) {
    //   let appointment = await Appointment.findById(doctorApp.appointmentId).populate('userId').populate('doctorId');
    //   appointments.push(appointment);
    //   // appointment.userId.password = undefined;
    //   // appointment.doctorId.password = undefined;
     
    // }
    let appointments = await Appointment.find({doctorId:doctorId}).populate('userId').populate('doctorId');
    console.log(appointments);
    return res.status(200).json({
      status: "success",
      appointments: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}

export async function updateAppointmentStatus(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  try {
    let doctorId = req.user.id;
    let appointmentId = req.params.aid;
    let status = req.body.status;
    let updatedApp = await Appointment.findOneAndUpdate({
      doctorId: doctorId,
      _id: appointmentId,
      status: status,
    });
    if (!updatedApp) {
      return res.status(400).json({
        status: "fail",
        message: "Appointment not updated",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Appointment updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
}

export async function cancelDoctorAppointment(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  const session = await mongoose.connection.startSession();
  let doctorId = req.user.id;
  let appointmentId = req.params.aid;
  let doctor = await Doctor.findById(doctorId);
  let appointment = await Appointment.findById(appointmentId);
  let temp_day = new Date(appointment.date).toLocaleDateString("en-US", {
    weekday: "long",
  });
  try {
    await session.withTransaction(async () => {
      await UserAppointment.findOneAndDelete(
        [{ appointmentId: appointmentId }],
        { session }
      );
      await DoctorAppointment.findOneAndDelete(
        [{ appointmentId: appointmentId }],
        { session }
      );
      await Appointment.findByIdAndDelete(appointmentId, { session });

      for (let day of doctor.availability) {
        if (day.day == temp_day) {
          for (let slot of day.slots) {
            if (
              slot.start == appointment.startTime &&
              slot.end == appointment.endTime
            ) {
              slot.status = "available";
            }
          }
        }
      }
      await Doctor.updateOne(
        { _id: doctorId },
        { $set: { availability: doctor.availability } },
        { session }
      );
    });
    session.endSession();
    return res.status(200).json({
      status: "success",
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
}

export async function getAvailableSlots(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
    try {
        const {date} = req.body;
        const status= req.query.status;
        let day=new Date(date.split('-').reverse().join('-')).toLocaleDateString('en-US', { weekday: 'long' });
        const doctor = await Doctor.findById(req.params.did);
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
        if(status==='booked'){
            const bookedSlots = dayAvailability.slots.filter(s => s.status === 'booked');
            return res.status(200).json({
                status: 'success',
                slots:bookedSlots
            });
        }
        const availableSlots = dayAvailability.slots.filter(s => s.status === 'available');
        return res.status(200).json({
            status: 'success',
            slots:availableSlots
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

export async function getSlotsByDoctorId(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  try {
    const doctor = await Doctor.findById(req.params.did);
    if (!doctor) {
      return res.status(404).json({
        status: "fail",
        message: "Doctor not found",
      });
    }
    return res.status(200).json({
      status: "success",
      availability: doctor.availability,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}

export async function getSlots(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  try {
    const { date } = req.body;
    let day = new Date(date.split("-").reverse().join("-")).toLocaleDateString(
      "en-US",
      { weekday: "long" }
    );
    const doctor = await Doctor.findById(req.params.did);
    if (!doctor) {
      return res.status(404).json({
        status: "fail",
        message: "Doctor not found",
      });
    }
    const dayAvailability = doctor.availability.find((d) => d.day === day);
    if (!dayAvailability) {
      return res.status(400).json({
        status: "fail",
        message: `No availability set for ${day}`,
      });
    }

    let slots = dayAvailability.slots;
    return res.status(200).json({
      status: "success",
      slots: slots,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}

export async function updateAvailabilityStatus(req, res) {
  /*
#swagger.tags = ['Doctor']
*/
  try {
    const { day, slot } = req.body;
    const doctor = await Doctor.findById(req.params.did);
    if (!doctor) {
      return res.status(404).json({
        status: "fail",
        message: "Doctor not found",
      });
    }

    const dayAvailability = doctor.availability.find((d) => d.day === day);
    if (!dayAvailability) {
      return res.status(400).json({
        status: "fail",
        message: `No availability set for ${day}`,
      });
    }
    let s = dayAvailability.slots.find(
      (s) => s.start === slot.start && s.end === slot.end
    );
    if (s.status === "available") {
      s.status = "booked";
    } else {
      return res.status(400).json({
        status: "fail",
        message: `Slot not available`,
      });
    }
    if (s.status === "booked") {
      s.status = "available";
    } else {
      return res.status(400).json({
        status: "fail",
        message: `Slot not available`,
      });
    }
    await doctor.save();

    return res.status(200).json({
      status: "success",
      message: "Availability updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}
