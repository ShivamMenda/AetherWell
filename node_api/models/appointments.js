import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'canceled', 'attended'], required: true }
}, { timestamps: true });

let Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;