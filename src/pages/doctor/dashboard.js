import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';

const Dashboard = () => {
  const router = useRouter();
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    // Fetch doctor info here if needed
    // For now just using placeholder
    setDoctorInfo({
      name: 'Dr. Smith',
      specialization: 'General Medicine',
      todayAppointments: 5
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Doctor Dashboard</h1>
          <button
            onClick={() => router.push('/doctor/landing')}
            className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 p-4">
        {doctorInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/doctor/appointments')}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  View Appointments
                </button>
                <button
                  onClick={() => router.push('/doctor/patient-records')}
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Patient Records
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
              <p>Appointments Today: {doctorInfo.todayAppointments}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <p>Name: {doctorInfo.name}</p>
              <p>Specialization: {doctorInfo.specialization}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default withAuth(Dashboard, ['doctor']);
