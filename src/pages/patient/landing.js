import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';
import { getSession, clearSession } from '../../utils/sessionManager';

const PatientLanding = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user } = getSession();
        if (user) {
          setUserData(user);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white flex justify-between">
        <h1 className="text-xl font-bold">Welcome, {userData?.name}</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {/* Edit Profile Card */}
            <div 
              onClick={() => router.push('/patient/profile')}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-3">Edit Profile</h2>
              <p className="text-gray-600">Update your personal information and medical details</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Manage Profile
              </button>
            </div>

            {/* Book Appointment Card */}
            <div 
              onClick={() => router.push('/patient/book-appointment')}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-3">Book Appointment</h2>
              <p className="text-gray-600">Schedule a consultation with our doctors</p>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                Book Now
              </button>
            </div>

            {/* View Medical History Card */}
            <div 
              onClick={() => router.push('/patient/medical-records')} // Updated route
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-3">Medical History</h2>
              <p className="text-gray-600">View your past appointments and medical records</p>
              <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded">
                View Records
              </button>
            </div>

            {/* Upcoming Appointments Card */}
            <div 
              onClick={() => router.push('/patient/appointments')}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-3">Upcoming Appointments</h2>
              <p className="text-gray-600">Manage your scheduled appointments</p>
              <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
                View Schedule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(PatientLanding, ['patient']);
