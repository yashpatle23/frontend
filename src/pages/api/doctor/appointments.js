import dbConnect from '../../../utils/dbConnect';
import Doctor from '../../../models/Doctor';
import Appointment from '../../../models/Appointment';
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

    switch (req.method) {
      case 'GET':
        const { type } = req.query;
        const currentDate = new Date();
        const query = {
          doctorId: decoded.id,
          ...(type === 'upcoming' 
            ? { date: { $gte: currentDate } }
            : { date: { $lt: currentDate } }
          )
        };

        const appointments = await Appointment.find(query)
          .populate('patientId', 'name')
          .sort({ date: type === 'upcoming' ? 1 : -1 });

        return res.status(200).json({ appointments });

      case 'PUT':
        const { appointmentId } = req.query;
        const { status } = req.body;

        const updatedAppointment = await Appointment.findByIdAndUpdate(
          appointmentId,
          { status },
          { new: true }
        );

        return res.status(200).json({ appointment: updatedAppointment });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Appointment error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
