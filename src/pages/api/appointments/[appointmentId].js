import dbConnect from "../../../utils/dbConnect";
import Appointment from "../../../models/Appointment";
import { verify } from "jsonwebtoken";
import { sendAppointmentEmail } from "../../../utils/emailService";
import Doctor from "../../../models/Doctor";
import Patient from "../../../models/Patient";

export default async function handler(req, res) {
  const { appointmentId } = req.query;
  await dbConnect();

  // Verify token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  const decoded = verify(token, "your_jwt_secret");
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (req.method === "DELETE") {
      const appointment = await Appointment.findById(appointmentId)
        .populate("doctor")
        .populate("patient");

      if (appointment) {
        await sendAppointmentEmail("cancelled", appointment);
        await Appointment.findByIdAndDelete(appointmentId);
      }

      return res
        .status(200)
        .json({ message: "Appointment cancelled successfully" });
    }

    if (req.method === "PUT") {
      // Validate date and slot
      const { date, slot } = req.body;
      if (!date || !slot) {
        return res.status(400).json({ message: "Missing date or slot" });
      }

      // Check if slot is available
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: appointmentId },
        date: new Date(date),
        slot,
        status: "booked",
      });

      if (existingAppointment) {
        return res.status(400).json({ message: "Slot already booked" });
      }

      // Update appointment
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { date: new Date(date), slot },
        { new: true }
      )
        .populate("doctor")
        .populate("patient");

      if (updatedAppointment) {
        await sendAppointmentEmail("rescheduled", updatedAppointment);
      }

      return res.status(200).json({ appointment: updatedAppointment });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Appointment operation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
