import dbConnect from '../../../utils/dbConnect';
import MedicalRecord from '../../../models/MedicalRecord';
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = verify(token, 'your_jwt_secret');
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });

    const { id } = req.query;
    const record = await MedicalRecord.findById(id)
      .populate('doctorId', 'name specialization');

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Verify access rights
    if (decoded.role === 'patient' && record.patientId !== decoded.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json({ record });

      case 'PUT':
        if (decoded.role !== 'doctor') {
          return res.status(403).json({ message: 'Only doctors can update records' });
        }

        const updatedRecord = await MedicalRecord.findByIdAndUpdate(
          id,
          { $set: req.body },
          { new: true }
        );

        return res.status(200).json({ record: updatedRecord });

      case 'DELETE':
        if (decoded.role !== 'doctor') {
          return res.status(403).json({ message: 'Only doctors can delete records' });
        }

        await MedicalRecord.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Record deleted successfully' });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Medical record error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
