import mongoose from "mongoose";

function generateSlots() {
    const slots = [];

    for (let hour = 7; hour < 21; hour++) {
        slots.push({ start: `${hour}:00`, end: `${hour + 1}:00` });
    }

    return slots;
}
const SlotSchema = new mongoose.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available', required: true }
});

const DayAvailabilitySchema = new mongoose.Schema({
    day: { type: String, required: true },
    slots: { type: [SlotSchema], required: true }
});

const DoctorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'doctor'], default: 'doctor', required: true },
    name: { type: String, required: true },
    gender:{ type:String },
    age: { type: Number, required: true },
    specialization: { type: String, required: true },
    hospital: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    availability: {
        type: [DayAvailabilitySchema],
        required: true,
        default: [
            { day: 'Monday', slots: generateSlots() },
            { day: 'Tuesday', slots: generateSlots() },
            { day: 'Wednesday', slots: generateSlots() },
            { day: 'Thursday', slots: generateSlots() },
            { day: 'Friday', slots: generateSlots() },
        ]
    }
});

let Doctor= mongoose.model('Doctor', DoctorSchema);

export default Doctor;

