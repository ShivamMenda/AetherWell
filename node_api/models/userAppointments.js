import mongoose from 'mongoose';

const UserAppointmentSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true }
});

const UserAppointment = mongoose.model('UserAppointment', UserAppointmentSchema);

export default UserAppointment;