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

    if (req.method === 'GET') {
      const patients = await Patient.find({}, {
        patientId: 1,
        name: 1,
        age: 1,
        lastVisit: 1
      }).sort({ lastVisit: -1 });

      return res.status(200).json({ patients });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Patients fetch error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
