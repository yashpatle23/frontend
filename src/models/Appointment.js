import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: String, required: true }, // changed from ObjectId to String
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  status: { type: String, default: 'booked' }
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
