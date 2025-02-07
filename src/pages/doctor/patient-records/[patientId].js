import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from '../../../components/withAuth';

const PatientRecordDetail = () => {
  const router = useRouter();
  const { patientId } = router.query;
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchMedicalRecords();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/patient/search?patientId=${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatient(response.data.patient);
    } catch (error) {
      setError('Failed to load patient data');
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/medical-records?patientId=${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.records);
    } catch (error) {
      setError('Failed to load medical records');
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedData = {
        ...editFormData,
        symptoms: editFormData.symptoms.split(',').map(s => s.trim())
      };

      await axios.put(`/api/medical-records/${selectedRecord._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchMedicalRecords();
      setIsEditing(false);
      setSelectedRecord(null);
      setEditFormData(null);
    } catch (error) {
      setError('Failed to update record');
    }
  };

  const initializeEditForm = (record) => {
    setEditFormData({
      diagnosis: record.diagnosis,
      chiefComplaint: record.chiefComplaint || '',
      symptoms: record.symptoms.join(', '),
      treatment: record.treatment || '',
      prescription: record.prescription || [{
        medicine: '',
        dosage: '',
        frequency: '',
        duration: ''
      }],
      vitals: record.vitals || {
        bloodPressure: '',
        temperature: '',
        heartRate: '',
        respiratoryRate: '',
        weight: '',
        height: ''
      },
      notes: record.notes || '',
      followUpDate: record.followUpDate ? new Date(record.followUpDate).toISOString().split('T')[0] : ''
    });
    setSelectedRecord(record);
    setIsEditing(true);
  };

  const addPrescriptionField = () => {
    setEditFormData({
      ...editFormData,
      prescription: [...editFormData.prescription, { 
        medicine: '', 
        dosage: '', 
        frequency: '', 
        duration: '' 
      }]
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-white font-bold">Patient Records</h1>
            {patient && (
              <p className="text-white">
                {patient.name} (ID: {patient.patientId})
              </p>
            )}
          </div>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/doctor/add-record?patientId=' + patientId)}
              className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-600"
            >
              Add New Record
            </button>
            <button
              onClick={() => router.push('/doctor/patient-records')}
              className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-700"
            >
              Back to Patients
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Patient Summary */}
        {patient && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-medium">{patient.age}</p>
              </div>
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Group</p>
                <p className="font-medium">{patient.bloodGroup}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{patient.phoneNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Medical Records */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Medical History</h2>
          {records.map((record) => (
            <div key={record._id} className="border-b last:border-0 py-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{record.diagnosis}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(record.visitDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => initializeEditForm(record)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium">Symptoms</p>
                  <p className="text-sm text-gray-600">
                    {record.symptoms.join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Treatment</p>
                  <p className="text-sm text-gray-600">{record.treatment}</p>
                </div>
              </div>
              {record.prescription && record.prescription.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Prescription</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {record.prescription.map((med, index) => (
                      <li key={index}>
                        {med.medicine} - {med.dosage} ({med.frequency}) for {med.duration}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Edit Record Modal */}
      {isEditing && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Medical Record</h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditFormData(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateRecord}>
              {/* Diagnosis */}
              <div className="mb-4">
                <label className="block mb-2">Diagnosis</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editFormData.diagnosis}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    diagnosis: e.target.value
                  })}
                  required
                />
              </div>

              {/* Chief Complaint */}
              <div className="mb-4">
                <label className="block mb-2">Chief Complaint</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editFormData.chiefComplaint}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    chiefComplaint: e.target.value
                  })}
                />
              </div>

              {/* Symptoms */}
              <div className="mb-4">
                <label className="block mb-2">Symptoms (comma separated)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editFormData.symptoms}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    symptoms: e.target.value
                  })}
                />
              </div>

              {/* Prescription */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold">Prescription</label>
                  <button
                    type="button"
                    onClick={addPrescriptionField}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Add Medicine
                  </button>
                </div>
                {editFormData.prescription.map((med, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Medicine"
                      className="p-2 border rounded"
                      value={med.medicine}
                      onChange={(e) => {
                        const newPrescription = [...editFormData.prescription];
                        newPrescription[index] = {
                          ...newPrescription[index],
                          medicine: e.target.value
                        };
                        setEditFormData({
                          ...editFormData,
                          prescription: newPrescription
                        });
                      }}
                    />
                    {/* Add similar input fields for dosage, frequency, and duration */}
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block mb-2">Additional Notes</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    notes: e.target.value
                  })}
                />
              </div>

              {/* Follow-up Date */}
              <div className="mb-4">
                <label className="block mb-2">Follow-up Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={editFormData.followUpDate}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    followUpDate: e.target.value
                  })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditFormData(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(PatientRecordDetail, ['doctor']);
