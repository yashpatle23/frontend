import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  chiefComplaint: String,
  diagnosis: {
    type: String,
    required: true
  },
  symptoms: [String],
  treatment: String,
  prescription: [{
    medicine: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  labTests: [{
    testName: String,
    result: String,
    date: Date
  }],
  vitals: {
    bloodPressure: String,
    temperature: Number,
    heartRate: Number,
    respiratoryRate: Number,
    weight: Number,
    height: Number
  },
  notes: String,
  followUpDate: Date,
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Add virtual populate fields
MedicalRecordSchema.virtual('doctor', {
  ref: 'Doctor',
  localField: 'doctorId',
  foreignField: '_id',
  justOne: true
});

MedicalRecordSchema.virtual('patient', {
  ref: 'Patient',
  localField: 'patientId',
  foreignField: 'patientId',
  justOne: true
});

export default mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', MedicalRecordSchema);
