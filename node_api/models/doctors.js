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
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'doctor'], default: 'doctor', required: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    hospital: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    availability: {
        type: [DayAvailabilitySchema],
        required: true,
        default: [
            { day: 'Monday', slots: generateSlots('9AM', '5PM') },
            { day: 'Tuesday', slots: generateSlots('9AM', '5PM') },
            { day: 'Wednesday', slots: generateSlots('9AM', '5PM') },
            { day: 'Thursday', slots: generateSlots('9AM', '5PM') },
            { day: 'Friday', slots: generateSlots('9AM', '5PM') }
        ]
    }
});

let Doctor= mongoose.model('Doctor', DoctorSchema);

export default Doctor;

function generateSlots(start, end) {
    const startHour = parseInt(start);
    const endHour = parseInt(end);
    const slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
        slots.push({ start: `${hour}:00`, end: `${hour + 1}:00` });
    }

    return slots;
}