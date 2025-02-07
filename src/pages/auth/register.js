import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const { role } = router.query;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    bloodGroup: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: ''
    },
    allergies: '',
    ...(role === 'patient' ? { age: '', gender: '' } : { specialization: '' })
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedFormData = {
        ...formData,
        role,
        ...(role === 'patient' ? {
          address: Object.keys(formData.address).every(key => formData.address[key] === '') 
            ? undefined 
            : formData.address,
          emergencyContact: Object.keys(formData.emergencyContact).every(key => formData.emergencyContact[key] === '')
            ? undefined
            : formData.emergencyContact,
          allergies: formData.allergies || undefined,
        } : {})
      };

      const response = await axios.post('/api/auth/register', processedFormData);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push(role === 'patient' ? '/patient/landing' : '/doctor/landing');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-[600px]">
        <h1 className="text-2xl font-bold mb-6">Register as {role}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {role === 'patient' ? (
            <>
              <div className="mb-4">
                <label className="block mb-2">Age</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Gender</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Blood Group</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Street"
                    className="p-2 border rounded"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, street: e.target.value}
                    })}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="p-2 border rounded"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, city: e.target.value}
                    })}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="p-2 border rounded"
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, state: e.target.value}
                    })}
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className="p-2 border rounded"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: {...formData.address, zipCode: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Emergency Contact</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    className="p-2 border rounded"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: {...formData.emergencyContact, name: e.target.value}
                    })}
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    className="p-2 border rounded"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: {...formData.emergencyContact, relationship: e.target.value}
                    })}
                  />
                  <input
                    type="tel"
                    placeholder="Contact Phone Number"
                    className="p-2 border rounded"
                    value={formData.emergencyContact.phoneNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: {...formData.emergencyContact, phoneNumber: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Allergies (separate with commas)</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  placeholder="e.g., Penicillin, Peanuts, etc."
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block mb-2">Specialization</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
