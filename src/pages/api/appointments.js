import dbConnect from "../../utils/dbConnect";
import Doctor from "../../models/Doctor";
import Appointment from "../../models/Appointment";
import { verify } from "jsonwebtoken";
import { sendAppointmentEmail } from "../../utils/emailService";
import Patient from "../../models/Patient";

export default async function handler(req, res) {
  await dbConnect();

  // Extract and verify token for all methods
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  const decoded = verify(token, "your_jwt_secret");
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const appointments = await Appointment.find({
        patient: decoded.id,
      })
        .populate("doctor", "name specialization")
        .sort({ date: 1 });

      return res.status(200).json({ appointments });
    } catch (error) {
      console.error("Fetch appointments error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "POST") {
    const { doctorId, date, slot } = req.body;
    console.log("Received appointment data:", { doctorId, date, slot });

    // Validate required fields
    if (!doctorId || !date || !slot) {
      return res.status(400).json({ message: "Missing appointment details" });
    }

    const patientId = decoded.id;

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays > 6) {
      return res
        .status(400)
        .json({ message: "Date must be within the next 6 days" });
    }

    try {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // Check if slot is already booked
      const alreadyBooked = await Appointment.findOne({
        doctor: doctorId, // Changed from doctorId to doctor
        date: {
          $gte: new Date(date + "T00:00:00Z"),
          $lte: new Date(date + "T23:59:59Z"),
        },
        slot,
      });

      if (alreadyBooked) {
        return res.status(400).json({ message: "Slot already booked" });
      }

      // Create appointment with correct field names
      const appointment = new Appointment({
        doctor: doctorId, // Changed from doctorId to doctor
        patient: decoded.id, // Changed from patientId to patient
        date: selectedDate,
        slot,
        status: "booked", // Changed from pending to booked
      });

      await appointment.save();

      // Fetch full doctor and patient details for email
      const populatedAppointment = await Appointment.findById(appointment._id)
        .populate("doctor")
        .populate("patient");

      await sendAppointmentEmail("booked", populatedAppointment);

      return res
        .status(200)
        .json({ message: "Appointment booked successfully" });
    } catch (error) {
      console.error("Booking error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
