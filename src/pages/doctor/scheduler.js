import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from '../../components/withAuth';

const DoctorScheduler = () => {
  const router = useRouter();
  const [schedule, setSchedule] = useState({
    monday: { isAvailable: false, slots: [] },
    tuesday: { isAvailable: false, slots: [] },
    wednesday: { isAvailable: false, slots: [] },
    thursday: { isAvailable: false, slots: [] },
    friday: { isAvailable: false, slots: [] },
    saturday: { isAvailable: false, slots: [] }
  });
  const [selectedDay, setSelectedDay] = useState('monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [newUnavailable, setNewUnavailable] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchSchedule();
    fetchUnavailableDates();
  }, []);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/doctor/schedule', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedule(response.data.schedule);
    } catch (error) {
      setError('Failed to load schedule');
    }
  };

  const fetchUnavailableDates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/doctor/schedule/unavailable', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnavailableDates(response.data.unavailableDates);
    } catch (error) {
      setError('Failed to load unavailable dates');
    }
  };

  const toggleDayAvailability = async (day) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/doctor/schedule', {
        day,
        isAvailable: !schedule[day].isAvailable
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSchedule();
    } catch (error) {
      setError('Failed to update availability');
    }
  };

  const addTimeSlot = async () => {
    if (!startTime || !endTime) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/doctor/schedule/slots', {
        day: selectedDay,
        startTime,
        endTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSchedule();
      setStartTime('');
      setEndTime('');
    } catch (error) {
      setError('Failed to add time slot');
    }
  };

  const removeTimeSlot = async (day, slotIndex) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/doctor/schedule/slots', {
        headers: { Authorization: `Bearer ${token}` },
        data: { day, slotIndex }
      });
      fetchSchedule();
    } catch (error) {
      setError('Failed to remove time slot');
    }
  };

  const addUnavailableDate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/doctor/schedule/unavailable', newUnavailable, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUnavailableDates();
      setNewUnavailable({ startDate: '', endDate: '', reason: '' });
    } catch (error) {
      setError('Failed to add unavailable date');
    }
  };

  const removeUnavailableDate = async (dateId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/doctor/schedule/unavailable/${dateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUnavailableDates();
    } catch (error) {
      setError('Failed to remove unavailable date');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Schedule Management</h1>
          <button
            onClick={() => router.push('/doctor/landing')}
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

        {/* Add Time Slot Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Time Slot</h2>
          <div className="grid grid-cols-4 gap-4">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="p-2 border rounded"
            >
              {Object.keys(schedule).map(day => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-2 border rounded"
              placeholder="Start Time"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="p-2 border rounded"
              placeholder="End Time"
            />
            <button
              onClick={addTimeSlot}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Slot
            </button>
          </div>
        </div>

        {/* Unavailable Dates Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Mark Unavailable Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              value={newUnavailable.startDate}
              onChange={(e) => setNewUnavailable({
                ...newUnavailable,
                startDate: e.target.value
              })}
              className="p-2 border rounded"
              min={new Date().toISOString().split('T')[0]}
            />
            <input
              type="date"
              value={newUnavailable.endDate}
              onChange={(e) => setNewUnavailable({
                ...newUnavailable,
                endDate: e.target.value
              })}
              className="p-2 border rounded"
              min={newUnavailable.startDate || new Date().toISOString().split('T')[0]}
            />
            <input
              type="text"
              placeholder="Reason (optional)"
              value={newUnavailable.reason}
              onChange={(e) => setNewUnavailable({
                ...newUnavailable,
                reason: e.target.value
              })}
              className="p-2 border rounded"
            />
            <button
              onClick={addUnavailableDate}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Mark as Unavailable
            </button>
          </div>

          {/* Unavailable Dates List */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Unavailable Dates</h3>
            <div className="space-y-2">
              {unavailableDates.map((date) => (
                <div key={date._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <div>
                    <span className="font-medium">
                      {new Date(date.startDate).toLocaleDateString()} - {new Date(date.endDate).toLocaleDateString()}
                    </span>
                    {date.reason && (
                      <span className="ml-2 text-gray-600">({date.reason})</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeUnavailableDate(date._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(schedule).map(([day, { isAvailable, slots }]) => (
            <div key={day} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold capitalize">{day}</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={() => toggleDayAvailability(day)}
                    className="mr-2"
                  />
                  Available
                </label>
              </div>
              
              {isAvailable ? (
                <div className="space-y-2">
                  {slots.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{`${slot.startTime} - ${slot.endTime}`}</span>
                      <button
                        onClick={() => removeTimeSlot(day, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {slots.length === 0 && (
                    <p className="text-gray-500 text-sm">No slots added</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Not available this day</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default withAuth(DoctorScheduler, ['doctor']);
