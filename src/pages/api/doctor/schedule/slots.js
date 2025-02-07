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
      case 'POST':
        const { day, startTime, endTime } = req.body;
        doctor.addTimeSlot(day, startTime, endTime);
        await doctor.save();
        return res.status(200).json({ schedule: doctor.schedule });

      case 'DELETE':
        const { day: deleteDay, slotIndex } = req.body;
        if (doctor.schedule[deleteDay]?.slots[slotIndex]) {
          doctor.schedule[deleteDay].slots.splice(slotIndex, 1);
          await doctor.save();
        }
        return res.status(200).json({ schedule: doctor.schedule });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Schedule slots error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
