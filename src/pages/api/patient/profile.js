import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verify(token, 'your_jwt_secret');
    if (!decoded || decoded.role !== 'patient') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const patient = await Patient.findOne({ patientId: decoded.id });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      return res.status(200).json(patient);
    }

    if (req.method === 'PUT') {
      const updateData = req.body;
      // Remove fields that shouldn't be updated
      delete updateData.patientId;
      delete updateData.email;
      delete updateData.password;

      const patient = await Patient.findOneAndUpdate(
        { patientId: decoded.id },
        { $set: updateData },
        { new: true }
      );

      return res.status(200).json(patient);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
