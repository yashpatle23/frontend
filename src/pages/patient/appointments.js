import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from '../../components/withAuth';

const Appointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/patient/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError(error.response?.data?.message || 'Failed to load appointments');
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Your Appointments</h1>
      {error && <p className="text-red-500">{error}</p>}
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((app, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p><strong>Doctor:</strong> Dr. {app.doctorName} ({app.specialization})</p>
              <p><strong>Date:</strong> {new Date(app.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {app.slot}</p>
              <p><strong>Status:</strong> {app.status}</p>
            </div>
          ))}
        </div>
      )}
      <button 
        onClick={() => router.push('/patient/landing')}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default withAuth(Appointments, ['patient']);
