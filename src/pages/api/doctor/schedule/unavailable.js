import dbConnect from '../../../../utils/dbConnect';
import Doctor from '../../../../models/Doctor';
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

    const doctor = await Doctor.findById(decoded.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json({ unavailableDates: doctor.unavailableDates });

      case 'POST':
        const { startDate, endDate, reason } = req.body;
        doctor.unavailableDates.push({ startDate, endDate, reason });
        await doctor.save();
        return res.status(200).json({ unavailableDates: doctor.unavailableDates });

      case 'DELETE':
        const { dateId } = req.query;
        doctor.unavailableDates = doctor.unavailableDates.filter(
          date => date._id.toString() !== dateId
        );
        await doctor.save();
        return res.status(200).json({ unavailableDates: doctor.unavailableDates });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Unavailable dates error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}