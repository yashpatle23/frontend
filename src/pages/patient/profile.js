import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from '../../components/withAuth';

const Profile = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/patient/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      setError('Failed to load profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/patient/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Patient Profile</h1>
            <p className="text-sm">ID: {profile.patientId}</p>
          </div>
          <button 
            onClick={() => router.push('/patient/landing')}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* PatientID - Non-editable */}
              <div className="col-span-2 bg-gray-50 p-4 rounded">
                <label className="block text-gray-700 font-semibold mb-2">Patient ID</label>
                <p className="text-gray-600">{profile.patientId}</p>
              </div>

              {/* Personal Details */}
              <InputField
                label="Name"
                value={formData.name}
                isEditing={isEditing}
                onChange={(value) => setFormData({...formData, name: value})}
              />
              
              <InputField
                label="Age"
                type="number"
                value={formData.age}
                isEditing={isEditing}
                onChange={(value) => setFormData({...formData, age: value})}
              />

              <InputField
                label="Gender"
                type="select"
                options={['male', 'female', 'other']}
                value={formData.gender}
                isEditing={isEditing}
                onChange={(value) => setFormData({...formData, gender: value})}
              />

              <InputField
                label="Blood Group"
                type="select"
                options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                value={formData.bloodGroup}
                isEditing={isEditing}
                onChange={(value) => setFormData({...formData, bloodGroup: value})}
              />

              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                isEditing={isEditing}
                onChange={(value) => setFormData({...formData, phoneNumber: value})}
              />

              {/* Email - Non-editable */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                {['street', 'city', 'state', 'zipCode'].map((field) => (
                  <InputField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData.address?.[field] || ''}
                    isEditing={isEditing}
                    onChange={(value) => setFormData({
                      ...formData,
                      address: { ...formData.address, [field]: value }
                    })}
                  />
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                {['name', 'relationship', 'phoneNumber'].map((field) => (
                  <InputField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData.emergencyContact?.[field] || ''}
                    isEditing={isEditing}
                    onChange={(value) => setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, [field]: value }
                    })}
                  />
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Allergies</h3>
              <InputField
                type="textarea"
                value={(formData.allergies || []).join(', ')}
                isEditing={isEditing}
                onChange={(value) => setFormData({
                  ...formData,
                  allergies: value.split(',').map(item => item.trim())
                })}
                placeholder="Enter allergies separated by commas"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(profile);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

// Helper component for form fields
const InputField = ({ label, type = "text", value, isEditing, onChange, options = [], placeholder = "" }) => {
  if (!isEditing) {
    return (
      <div>
        <label className="block text-gray-700 font-semibold mb-2">{label}</label>
        <p className="text-gray-600">{value || 'Not specified'}</p>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div>
        <label className="block text-gray-700 font-semibold mb-2">{label}</label>
        <select
          className="w-full p-2 border rounded"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <label className="block text-gray-700 font-semibold mb-2">{label}</label>
        <textarea
          className="w-full p-2 border rounded"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        type={type}
        className="w-full p-2 border rounded"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default withAuth(Profile, ['patient']);
