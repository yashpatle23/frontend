import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';

const DoctorLanding = () => {
  const router = useRouter();
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setDoctorData(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleNavigation = (path) => {
    router.push(`/doctor/${path}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            <p className="text-sm">Dr. {doctorData?.name}</p>
            <p className="text-sm">{doctorData?.specialization}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Appointments Management */}
          <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Appointments</h2>
            <p className="text-gray-600">View and manage your appointments</p>
            <button 
              onClick={() => handleNavigation('appointments')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Manage Appointments
            </button>
          </div>

          {/* Schedule Management */}
          <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Schedule</h2>
            <p className="text-gray-600">Set your availability and time slots</p>
            <button 
              onClick={() => handleNavigation('scheduler')}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Manage Schedule
            </button>
          </div>

          {/* Patient Records */}
          <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Patient Records</h2>
            <p className="text-gray-600">Access and update patient medical records</p>
            <button 
              onClick={() => handleNavigation('patient-records')}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              View Records
            </button>
          </div>

          {/* Add Medical Record */}
          <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Add Medical Record</h2>
            <p className="text-gray-600">Create new medical records for patients</p>
            <button 
              onClick={() => handleNavigation('add-record')}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Add Record
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Pending Reports</h3>
            <p className="text-3xl font-bold text-yellow-600">0</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(DoctorLanding, ['doctor']);
