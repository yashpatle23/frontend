import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from '../../components/withAuth';

const BookAppointment = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAvailableDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchAvailableDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/doctor/available', { // updated endpoint
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.doctors) {
        setDoctors(response.data.doctors);
      } else {
        setError('No doctors available at the moment');
      }
    } catch (error) {
      console.error('Doctor fetch error:', error);
      setError(error.response?.data?.message || 'Failed to load doctors. Please try again later.');
      setDoctors([]);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/doctors/${selectedDoctor}/slots`, {
        params: { date: selectedDate },
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableSlots(response.data.slots);
    } catch (error) {
      setError('Failed to load available slots');
    }
  };

  const handleBookAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/appointments', {
        doctorId: selectedDoctor,
        date: selectedDate,
        slot: selectedSlot
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Appointment booked successfully!');
      setTimeout(() => {
        router.push('/patient/appointments');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  // Get the day name from date
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'lowercase' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Book Appointment</h1>
          <button
            onClick={() => router.push('/patient/landing')}
            className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-8 p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Doctor Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Doctor</h2>
            {doctors.length === 0 ? (
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-gray-600">
                  {error || 'No doctors available at the moment. Please try again later.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => setSelectedDoctor(doctor._id)}
                    className={`p-4 border rounded cursor-pointer ${
                      selectedDoctor === doctor._id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <h3 className="font-medium">Dr. {doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Selection */}
          {selectedDoctor && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <input
                type="date"
                className="w-full p-2 border rounded"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}

          {/* Time Slots */}
          {selectedDate && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Select Time Slot</h2>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 border rounded ${
                        selectedSlot === slot ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No available slots for the selected date.</p>
              )}
            </div>
          )}

          {/* Booking Button */}
          {selectedSlot && (
            <button
              onClick={handleBookAppointment}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirm Booking
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default withAuth(BookAppointment, ['patient']);
