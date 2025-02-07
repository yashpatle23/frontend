import dbConnect from '../../../../utils/dbConnect';
import Doctor from '../../../../models/Doctor';

function generateSlots(startHour, endHour) {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
}

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { doctorId, date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }
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
    
    // Check only unavailableDates: if the selected date falls within any unavailable date range, return no slots.
    const isUnavailable = doctor.unavailableDates.some(unav => {
      const start = new Date(unav.startDate);
      const end = new Date(unav.endDate);
      return selectedDate >= start && selectedDate <= end;
    });
    if (isUnavailable) {
      return res.status(200).json({ slots: [] });
    }
    
    // (Optional) If doctor.schedule exists as an object, you can optionally check schedule availability.
    // Otherwise, we assume the doctor is available if not restricted by unavailableDates.
    // const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    // if (doctor.schedule && (!doctor.schedule[dayName] || !doctor.schedule[dayName].isAvailable)) {
    //   return res.status(200).json({ slots: [] });
    // }
    
    // Generate slots for two sessions: 9-12 and 15-18.
    const allSlots = [...generateSlots(9, 12), ...generateSlots(15, 18)];
    
    // Filter out slots already booked in doctor's appointments for that day.
    const bookedSlots = doctor.appointments
      .filter(app => new Date(app.date).toISOString().split('T')[0] === date)
      .map(app => app.slot);
    
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    return res.status(200).json({ slots: availableSlots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}