import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
    sparse: true // Allows documents to be created without patientId initially
  },
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    _id: false // Prevent Mongoose from creating _id for subdocument
  },
  bloodGroup: {
    type: String,
    required: false
  },
  allergies: {
    type: [String],
    default: []
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String,
    _id: false // Prevent Mongoose from creating _id for subdocument
  },
  appointments: [{
    date: Date,
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    status: String
  }],
  medicalRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  }],
  medicalHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Add method to get medical records
PatientSchema.methods.getMedicalRecords = async function() {
  return await mongoose.model('MedicalRecord').find({ patientId: this.patientId })
    .sort({ visitDate: -1 })
    .populate('doctorId', 'name specialization');
};

// Add method to get medical history
PatientSchema.methods.getMedicalHistory = async function() {
  return await mongoose.model('MedicalRecord')
    .find({ patientId: this.patientId })
    .populate('doctorId', 'name specialization')
    .sort({ visitDate: -1 });
};

// Modify pre-save middleware
PatientSchema.pre('save', async function(next) {
  try {
    if (!this.patientId) {
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString().substr(-2);
      // Get the count of existing patients and add 1
      const count = await mongoose.models.Patient.countDocuments();
      const nextNumber = count + 1;
      this.patientId = `P${year}${nextNumber.toString().padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
