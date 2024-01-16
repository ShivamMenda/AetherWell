import mongoose from 'mongoose';

const DoctorAppointmentSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true }
});

const DoctorAppointment = mongoose.model('DoctorAppointment', DoctorAppointmentSchema);

export default DoctorAppointment;