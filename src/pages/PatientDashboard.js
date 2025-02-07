import React, { useState, useEffect } from "react";
import axios from 'axios';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/patient/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white flex justify-between">
        <h1 className="text-xl font-bold">Patient Dashboard</h1>
        <button className="bg-red-500 px-4 py-2 rounded">Logout</button>
      </nav>

      <div className="max-w-5xl mx-auto mt-8 p-4">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Patient ID</p>
              <p className="font-medium">{patientData?.patientId}</p>
            </div>
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{patientData?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Age</p>
              <p className="font-medium">{patientData?.age}</p>
            </div>
            <div>
              <p className="text-gray-600">Blood Group</p>
              <p className="font-medium">{patientData?.bloodGroup}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{patientData?.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{patientData?.email}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Address</h3>
            <p>{patientData?.address?.street}</p>
            <p>{patientData?.address?.city}, {patientData?.address?.state} {patientData?.address?.zipCode}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Emergency Contact</h3>
            <p>{patientData?.emergencyContact?.name} ({patientData?.emergencyContact?.relationship})</p>
            <p>{patientData?.emergencyContact?.phoneNumber}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Allergies</h3>
            <p>{patientData?.allergies?.join(', ') || 'None'}</p>
          </div>
          
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Update Details
          </button>
        </div>

        {/* Appointments Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Appointments</h2>
          <p>Next Appointment: 15th Feb, 3:00 PM</p>
          <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded">
            Book New Appointment
          </button>
          <button className="ml-2 mt-3 bg-yellow-500 text-white px-4 py-2 rounded">
            Reschedule
          </button>
          <button className="ml-2 mt-3 bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>

        {/* Medical Records Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Medical Records</h2>
          <p>Last Visit: 10th Jan</p>
          <p>Diagnosis: Flu</p>
          <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">
            View Full Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
