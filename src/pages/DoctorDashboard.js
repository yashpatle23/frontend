import React, { useState, useEffect } from "react";
import axios from 'axios';

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/doctor/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctorData(response.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctorData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white flex justify-between">
        <h1 className="text-xl font-bold">Doctor Dashboard</h1>
        <button className="bg-red-500 px-4 py-2 rounded">Logout</button>
      </nav>

      <div className="max-w-5xl mx-auto mt-8 p-4">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Doctor Profile</h2>
          <p>Name: {doctorData?.name}</p>
          <p>Specialization: {doctorData?.specialization}</p>
          <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">
            Update Profile
          </button>
        </div>

        {/* Manage Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Manage Appointments</h2>
          <p>Upcoming Appointment: 15th Feb, 3:00 PM</p>
          <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded">
            View Schedule
          </button>
          <button className="ml-2 mt-3 bg-yellow-500 text-white px-4 py-2 rounded">
            Edit Slots
          </button>
        </div>

        {/* Patient Records */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Patient Records</h2>
          <p>Patient: John Doe</p>
          <p>Diagnosis: Flu</p>
          <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">
            Update Records
          </button>
          <button className="ml-2 mt-3 bg-green-500 text-white px-4 py-2 rounded">
            View All Patients
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
