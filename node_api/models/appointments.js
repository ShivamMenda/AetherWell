import mongoose, { Schema } from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'canceled', 'attended'], required: true, default:'pending' }
}, { timestamps: true });

let Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;