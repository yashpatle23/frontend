import dbConnect from '../../../utils/dbConnect';
import MedicalRecord from '../../../models/MedicalRecord';
import Patient from '../../../models/Patient';
import Doctor from '../../../models/Doctor'; // Add this import
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = verify(token, 'your_jwt_secret');
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });

    switch (req.method) {
      case 'GET':
        // Check permission
        if (!['doctor', 'patient'].includes(decoded.role)) {
          return res.status(403).json({ message: 'Unauthorized access' });
        }

        const { patientId } = req.query;
        const query = decoded.role === 'patient' 
          ? { patientId: decoded.id }
          : { patientId };

        // First get records without population
        const records = await MedicalRecord.find(query).sort({ visitDate: -1 });

        // Then manually get doctor information
        const populatedRecords = await Promise.all(
          records.map(async (record) => {
            const recordObj = record.toObject();
            try {
              const doctor = await Doctor.findById(recordObj.doctorId);
              return {
                ...recordObj,
                doctor: doctor ? {
                  name: doctor.name,
                  specialization: doctor.specialization
                } : null
              };
            } catch (error) {
              return recordObj;
            }
          })
        );

        return res.status(200).json({ records: populatedRecords });

      case 'POST':
        // Only doctors can create records
        if (decoded.role !== 'doctor') {
          return res.status(403).json({ message: 'Only doctors can create medical records' });
        }

        const newRecord = await MedicalRecord.create({
          ...req.body,
          doctorId: decoded.id
        });

        // Update patient's medical records array
        await Patient.findOneAndUpdate(
          { patientId: req.body.patientId },
          { $push: { medicalRecords: newRecord._id } }
        );

        return res.status(201).json({ 
          success: true,
          record: newRecord 
        });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Medical records error:', error);
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
}
