import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verify(token, 'your_jwt_secret');
    if (!decoded || decoded.role !== 'doctor') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { patientId } = req.query;
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ 
      patient: {
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup
      }
    });
  } catch (error) {
    console.error('Patient search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
