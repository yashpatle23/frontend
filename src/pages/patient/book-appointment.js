import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import withAuth from "../../components/withAuth";

const BookAppointment = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAvailableDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchAvailableDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/doctor/available", {
        // updated endpoint
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.doctors) {
        setDoctors(response.data.doctors);
      } else {
        setError("No doctors available at the moment");
      }
    } catch (error) {
      console.error("Doctor fetch error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load doctors. Please try again later."
      );
      setDoctors([]);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/doctors/${selectedDoctor}/slots`, {
        params: { date: selectedDate },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableSlots(response.data.slots);
    } catch (error) {
      setError("Failed to load available slots");
    }
  };

  const handleBookAppointment = async () => {
    try {
      const token = localStorage.getItem("token");

      // Format the date to match MongoDB expected format
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

      console.log("Sending appointment data:", {
        doctorId: selectedDoctor,
        date: formattedDate,
        slot: selectedSlot,
      });

      const response = await axios.post(
        "/api/appointments",
        {
          doctorId: selectedDoctor,
          date: formattedDate,
          slot: selectedSlot,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Appointment booked successfully!");
      setError(""); // Clear any existing errors
      setTimeout(() => {
        router.push("/patient/appointments");
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error.response?.data || error);
      // Clear success message if there was one
      setSuccess("");
      // Set error message and scroll to top
      setError(error.response?.data?.message || "Failed to book appointment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get the day name from date
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "lowercase" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Book Appointment</h1>
          <button
            onClick={() => router.push("/patient/landing")}
            className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6">
        {/* Status messages with improved styling */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="py-1">
                <svg
                  className="w-6 h-6 mr-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold">Booking Error</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-sm">
            <p className="font-bold">{success}</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Doctor Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Doctor</h2>
            {doctors.length === 0 ? (
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-gray-600">
                  {error || "No doctors available at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => setSelectedDoctor(doctor._id)}
                    className={`p-4 border rounded cursor-pointer ${
                      selectedDoctor === doctor._id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                  >
                    <h3 className="font-medium">Dr. {doctor.name}</h3>
                    <p className="text-sm text-gray-600">
                      {doctor.specialization}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Date Selection */}
          {selectedDoctor && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <input
                type="date"
                className="w-full p-2 border rounded"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}
          {/* Time Slots */}
          {selectedDate && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Select Time Slot</h2>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 border rounded ${
                        selectedSlot === slot
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No available slots for the selected date.</p>
              )}
            </div>
          )}
          {/* Booking Button */}
          {selectedSlot && (
            <button
              onClick={handleBookAppointment}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirm Booking
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default withAuth(BookAppointment, ["patient"]);
