import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// axios import removed
import withAuth from "../../components/withAuth";

const DoctorAppointments = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // API calls removed; using stubs instead
    setAppointments([]);
    setAvailableSlots([]);
  }, [activeTab]);

  const updateAppointmentStatus = async (appointmentId, status) => {
    // API call removed; stub implementation
    console.log(
      `updateAppointmentStatus called for ${appointmentId} with ${status}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">
            Appointment Management
          </h1>
          <button
            onClick={() => router.push("/doctor/landing")}
            className="bg-blue-500 px-4 py-2 text-white rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 p-4">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "upcoming"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Appointments
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "past" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Appointments
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "slots" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("slots")}
          >
            Available Slots
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "slots" ? (
            <TimeSlots onUpdate={() => {}} />
          ) : (
            <AppointmentsList
              appointments={appointments}
              type={activeTab}
              onUpdateStatus={updateAppointmentStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
};

const TimeSlots = ({ onUpdate }) => {
  const addSlot = async (day, time) => {
    // API call removed; stub implementation
    console.log(`addSlot called for ${day} at ${time}`);
    onUpdate();
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {Object.entries([]).map(([day, times]) => (
        <div key={day} className="border rounded p-4">
          <h3 className="font-semibold mb-4">{day}</h3>
          <div className="space-y-2">
            {times.map((time) => (
              <div key={time} className="flex justify-between items-center">
                <span>{time}</span>
                <button className="text-red-500">Remove</button>
              </div>
            ))}
          </div>
          <input
            type="time"
            className="mt-4 p-2 border rounded"
            onChange={(e) => addSlot(day, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

const AppointmentsList = ({ appointments, type, onUpdateStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Patient Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td className="px-6 py-4">{appointment.patientName}</td>
              <td className="px-6 py-4">
                {new Date(appointment.date).toLocaleString()}
              </td>
              <td className="px-6 py-4">{appointment.status}</td>
              <td className="px-6 py-4">
                {type === "upcoming" && (
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        onUpdateStatus(appointment._id, "completed")
                      }
                      className="text-green-600 hover:text-green-900"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() =>
                        onUpdateStatus(appointment._id, "cancelled")
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAuth(DoctorAppointments, ["doctor"]);
