import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from '../../components/withAuth';

const PatientMedicalRecords = () => {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
      fetchMedicalRecords();
    }
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/medical-records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.records);
    } catch (error) {
      setError('Failed to load medical records');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-white font-bold">My Medical Records</h1>
            <p className="text-white">Patient ID: {userData?.patientId}</p>
          </div>
          <button
            onClick={() => router.push('/patient/landing')}
            className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {records.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No medical records found.</p>
          ) : (
            <div className="space-y-6">
              {records.map((record) => (
                <div key={record._id} className="border-b pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{record.diagnosis}</h3>
                      <p className="text-sm text-gray-600">
                        Visit Date: {new Date(record.visitDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Doctor: Dr. {record.doctor?.name} ({record.doctor?.specialization})
                      </p>
                    </div>
                    {record.followUpDate && (
                      <div className="bg-blue-50 px-3 py-1 rounded">
                        <p className="text-sm text-blue-600">
                          Follow-up: {new Date(record.followUpDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Show Medical Details */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Symptoms</h4>
                      <p className="text-gray-600">{record.symptoms.join(', ')}</p>
                    </div>

                    {record.treatment && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Treatment</h4>
                        <p className="text-gray-600">{record.treatment}</p>
                      </div>
                    )}

                    {/* Show Prescription */}
                    {record.prescription && record.prescription.length > 0 && (
                      <div className="col-span-2 mt-2">
                        <h4 className="font-medium text-sm mb-1">Prescription</h4>
                        <div className="bg-gray-50 p-3 rounded">
                          {record.prescription.map((med, index) => (
                            <div key={index} className="text-sm text-gray-600 mb-1">
                              {med.medicine} - {med.dosage} ({med.frequency}) for {med.duration}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show Vitals */}
                    {record.vitals && Object.values(record.vitals).some(value => value) && (
                      <div className="col-span-2 mt-2">
                        <h4 className="font-medium text-sm mb-1">Vitals</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {record.vitals.bloodPressure && (
                            <p className="text-sm text-gray-600">BP: {record.vitals.bloodPressure}</p>
                          )}
                          {record.vitals.temperature && (
                            <p className="text-sm text-gray-600">Temperature: {record.vitals.temperature}°F</p>
                          )}
                          {record.vitals.heartRate && (
                            <p className="text-sm text-gray-600">Heart Rate: {record.vitals.heartRate} bpm</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Show Notes */}
                    {record.notes && (
                      <div className="col-span-2 mt-2">
                        <h4 className="font-medium text-sm mb-1">Additional Notes</h4>
                        <p className="text-gray-600">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default withAuth(PatientMedicalRecords, ['patient']);
