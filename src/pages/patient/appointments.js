import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import withAuth from "../../components/withAuth";

const Appointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  // Reschedule form state
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [success, setSuccess] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.response?.data?.message || "Failed to load appointments");
    }
  };

  const fetchRescheduleSlots = async (doctorId, date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/doctors/${doctorId}/slots`, {
        params: { date },
        headers: { Authorization: `Bearer ${token}` },
      });
      setRescheduleSlots(response.data.slots);
    } catch (error) {
      setError("Failed to load available slots");
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Appointment cancelled successfully");
        fetchAppointments();
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to cancel appointment"
        );
      }
    }
  };

  const handleReschedule = async (appointment) => {
    setRescheduleId(appointment._id);
    setNewDate("");
    setNewSlot("");
    setRescheduleSlots([]);
  };

  const handleRescheduleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/appointments/${rescheduleId}`,
        {
          date: newDate,
          slot: newSlot,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Appointment rescheduled successfully");
      setRescheduleId(null);
      fetchAppointments();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to reschedule appointment"
      );
    }
  };

  const RescheduleForm = () => {
    const appointment = appointments.find((a) => a._id === rescheduleId);
    if (!rescheduleId || !appointment) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-lg font-bold mb-4">Reschedule Appointment</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split("T")[0]}
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                if (e.target.value) {
                  fetchRescheduleSlots(appointment.doctor._id, e.target.value);
                }
              }}
            />
          </div>
          {newDate && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                New Time Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                {rescheduleSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setNewSlot(slot)}
                    className={`p-2 border rounded ${
                      newSlot === slot ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setRescheduleId(null)}
              className="px-4 py-2 text-gray-600 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleRescheduleSubmit}
              disabled={!newDate || !newSlot}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">My Appointments</h1>
          <button
            onClick={() => router.push("/patient/landing")}
            className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>

          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No appointments found.</p>
              <button
                onClick={() => router.push("/patient/book-appointment")}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Book New Appointment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {appointment.doctor?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.doctor?.specialization}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.slot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            appointment.status === "booked"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {appointment.status === "booked" && (
                          <>
                            <button
                              onClick={() => handleCancel(appointment._id)}
                              className="text-red-600 hover:text-red-900 mr-4"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReschedule(appointment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Reschedule
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      {rescheduleId && <RescheduleForm />}
    </div>
  );
};

export default withAuth(Appointments, ["patient"]);
