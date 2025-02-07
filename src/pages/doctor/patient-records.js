import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import withAuth from "../../components/withAuth";

const PatientRecords = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/doctor/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data.patients);
    } catch (error) {
      setError("Failed to load patients");
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      (patient?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (patient?.patientId?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Patient Records</h1>
          <button
            onClick={() => router.push("/doctor/landing")}
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
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.patientId}>
                    <td className="px-6 py-4">{patient.patientId}</td>
                    <td className="px-6 py-4">{patient.name}</td>
                    <td className="px-6 py-4">{patient.age}</td>
                    <td className="px-6 py-4">
                      {patient.lastVisit
                        ? new Date(patient.lastVisit).toLocaleDateString()
                        : "No visits yet"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          router.push(
                            `/doctor/patient-records/${patient.patientId}`
                          )
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Records
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(PatientRecords, ["doctor"]);
