import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from '../../components/withAuth';

const AddMedicalRecord = () => {
  const router = useRouter();
  const [patientId, setPatientId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [patientFound, setPatientFound] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    prescription: [{
      medicine: '',
      dosage: '',
      frequency: '',
      duration: ''
    }],
    vitals: {
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      weight: '',
      height: ''
    },
    notes: '',
    followUpDate: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const initialFormState = {
    chiefComplaint: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    prescription: [{
      medicine: '',
      dosage: '',
      frequency: '',
      duration: ''
    }],
    vitals: {
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      weight: '',
      height: ''
    },
    notes: '',
    followUpDate: ''
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setPatientId('');
    setPatientFound(false);
    setPatientData(null);
  };

  const searchPatient = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/patient/search?patientId=${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatientData(response.data.patient);
      setPatientFound(true);
      setSearchError('');
    } catch (error) {
      setSearchError('Patient not found');
      setPatientFound(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/medical-records', {
        ...formData,
        patientId,
        symptoms: formData.symptoms.split(',').map(s => s.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccessMessage('Medical record saved successfully!');
        resetForm();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      setSearchError('Error saving medical record');
    }
  };

  const addPrescriptionField = () => {
    setFormData({
      ...formData,
      prescription: [...formData.prescription, { medicine: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Add Medical Record</h1>
          <button
            onClick={() => router.push('/doctor/landing')}
            className="bg-blue-500 px-4 py-2 text-white rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-8 p-4">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        {searchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {searchError}
          </div>
        )}

        {/* Patient Search */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={searchPatient}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search Patient
            </button>
          </div>
          {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
          {patientFound && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">Patient Information</h3>
              <p>Name: {patientData.name}</p>
              <p>Age: {patientData.age}</p>
              <p>Gender: {patientData.gender}</p>
            </div>
          )}
        </div>

        {patientFound && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            {/* Chief Complaint */}
            <div className="mb-4">
              <label className="block mb-2">Chief Complaint</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
                required
              />
            </div>

            {/* Diagnosis */}
            <div className="mb-4">
              <label className="block mb-2">Diagnosis</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.diagnosis}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                required
              />
            </div>

            {/* Symptoms */}
            <div className="mb-4">
              <label className="block mb-2">Symptoms (comma separated)</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                required
              />
            </div>

            {/* Vitals */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Vitals</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Blood Pressure"
                  className="p-2 border rounded"
                  value={formData.vitals.bloodPressure}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitals: {...formData.vitals, bloodPressure: e.target.value}
                  })}
                />
                <input
                  type="number"
                  placeholder="Temperature"
                  className="p-2 border rounded"
                  value={formData.vitals.temperature}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitals: {...formData.vitals, temperature: e.target.value}
                  })}
                />
                {/* Add other vital fields similarly */}
              </div>
            </div>

            {/* Prescription */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Prescription</h3>
                <button
                  type="button"
                  onClick={addPrescriptionField}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                  Add Medicine
                </button>
              </div>
              {formData.prescription.map((med, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Medicine"
                    className="p-2 border rounded"
                    value={med.medicine}
                    onChange={(e) => {
                      const newPrescription = [...formData.prescription];
                      newPrescription[index].medicine = e.target.value;
                      setFormData({...formData, prescription: newPrescription});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    className="p-2 border rounded"
                    value={med.dosage}
                    onChange={(e) => {
                      const newPrescription = [...formData.prescription];
                      newPrescription[index].dosage = e.target.value;
                      setFormData({...formData, prescription: newPrescription});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    className="p-2 border rounded"
                    value={med.frequency}
                    onChange={(e) => {
                      const newPrescription = [...formData.prescription];
                      newPrescription[index].frequency = e.target.value;
                      setFormData({...formData, prescription: newPrescription});
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    className="p-2 border rounded"
                    value={med.duration}
                    onChange={(e) => {
                      const newPrescription = [...formData.prescription];
                      newPrescription[index].duration = e.target.value;
                      setFormData({...formData, prescription: newPrescription});
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block mb-2">Additional Notes</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            {/* Follow-up Date */}
            <div className="mb-4">
              <label className="block mb-2">Follow-up Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={formData.followUpDate}
                onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Save Medical Record
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default withAuth(AddMedicalRecord, ['doctor']);
