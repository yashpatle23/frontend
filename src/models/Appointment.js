import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled'],
    default: 'booked'
  }
}, {
  timestamps: true
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
