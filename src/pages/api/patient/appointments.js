import dbConnect from "../../../utils/dbConnect";
import Appointment from "../../../models/Appointment";
import Doctor from "../../../models/Doctor"; // added import to register Doctor schema
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = verify(token, "your_jwt_secret");
    if (!decoded || decoded.role !== "patient") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const patientId = decoded.id;

    // Fetch appointments from Appointment collection and populate doctor name and specialization
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name specialization")
      .lean();

    // Transform data if needed
    const transformed = appointments.map((app) => ({
      _id: app._id,
      doctorName: app.doctor?.name,
      doctorId: app.doctor?._id,
      specialization: app.doctor?.specialization,
      date: app.date,
      slot: app.slot,
      status: app.status,
    }));

    return res.status(200).json({ appointments: transformed });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
