import dbConnect from '../../utils/dbConnect';
import Doctor from '../../models/Doctor';
import Appointment from '../../models/Appointment';
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    const { doctorId, date, slot } = req.body;
    if (!doctorId || !date || !slot) {
      return res.status(400).json({ message: 'Missing appointment details' });
    }
    
    // Extract patient id from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = verify(token, 'your_jwt_secret');
    if (!decoded || decoded.role !== 'patient') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const patientId = decoded.id;
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));
    if(diffDays < 0 || diffDays > 6) {
      return res.status(400).json({ message: 'Date must be within the next 6 days' });
    }
    
    try {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      // Check if the slot is already booked using the Appointment collection
      const alreadyBooked = await Appointment.findOne({
        doctor: doctorId,
        date: { $gte: new Date(date + "T00:00:00Z"), $lte: new Date(date + "T23:59:59Z") },
        slot
      });
      if (alreadyBooked) {
        return res.status(400).json({ message: 'Slot already booked' });
      }
      
      // Create a new Appointment with the patient extracted from token
      const appointment = new Appointment({
        doctor: doctorId,
        patient: patientId,
        date: selectedDate,
        slot,
        status: 'booked'
      });
      await appointment.save();
      return res.status(200).json({ message: 'Appointment booked successfully' });
    } catch (error) {
      console.error('Booking error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
