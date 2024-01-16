import mongoose from "mongoose";


const SlotSchema = new mongoose.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true }
});

const DayAvailabilitySchema = new mongoose.Schema({
    day: { type: String, required: true },
    slots: { type: [SlotSchema], required: true }
});

const DoctorSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'doctor'], default: 'doctor', required: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    hospital: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: String, required: true },
    availability: { type: [DayAvailabilitySchema], required: true }
});

let Doctor= mongoose.model('Doctor', DoctorSchema);

export default Doctor;