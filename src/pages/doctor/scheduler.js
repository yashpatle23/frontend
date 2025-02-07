import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import withAuth from "../../components/withAuth";

const DoctorScheduler = () => {
  const router = useRouter();
  const [newUnavailable, setNewUnavailable] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/doctor/schedule/unavailable", newUnavailable, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/doctor/landing");
    } catch (error) {
      setError("Failed to update unavailable dates");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">
            Set Unavailable Dates
          </h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Mark Dates When You Are Not Available
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              value={newUnavailable.startDate}
              onChange={(e) =>
                setNewUnavailable({
                  ...newUnavailable,
                  startDate: e.target.value,
                })
              }
              className="p-2 border rounded"
              min={new Date().toISOString().split("T")[0]}
            />
            <input
              type="date"
              value={newUnavailable.endDate}
              onChange={(e) =>
                setNewUnavailable({
                  ...newUnavailable,
                  endDate: e.target.value,
                })
              }
              className="p-2 border rounded"
              min={
                newUnavailable.startDate ||
                new Date().toISOString().split("T")[0]
              }
            />
            <input
              type="text"
              placeholder="Reason (optional)"
              value={newUnavailable.reason}
              onChange={(e) =>
                setNewUnavailable({ ...newUnavailable, reason: e.target.value })
              }
              className="p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
      </main>
    </div>
  );
};

export default withAuth(DoctorScheduler, ["doctor"]);
