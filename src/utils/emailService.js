import nodemailer from "nodemailer";
import Patient from "../models/Patient";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password here
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter connection on server start
transporter.verify((error, success) => {
  if (error) {
    console.error("Email service verification failed:", error);
  } else {
    console.log("Email server connection verified and ready");
  }
});

export const sendAppointmentEmail = async (type, appointmentData) => {
  try {
    // Fetch patient details from database
    const patientDetails = await Patient.findOne({
      patientId: appointmentData.patient,
    });

    if (!appointmentData?.doctor?.email || !patientDetails?.email) {
      console.error("Missing email addresses:", {
        doctor: appointmentData?.doctor?.email,
        patient: patientDetails?.email,
      });
      return false;
    }

    const { doctor, date, slot } = appointmentData;
    const patient = {
      email: patientDetails.email,
      name: patientDetails.name,
    };

    console.log("Sending email for:", {
      type,
      doctor: doctor?.email,
      patient: patient?.email,
    });

    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const emailTemplates = {
      booked: {
        subject: "New Appointment Booked",
        patientText: `Your appointment has been booked with Dr. ${
          doctor.name
        } for ${formatDate(date)} at ${slot}.`,
        doctorText: `A new appointment has been booked with ${
          patient.name
        } for ${formatDate(date)} at ${slot}.`,
      },
      rescheduled: {
        subject: "Appointment Rescheduled",
        patientText: `Your appointment with Dr. ${
          doctor.name
        } has been rescheduled to ${formatDate(date)} at ${slot}.`,
        doctorText: `Your appointment with ${
          patient.name
        } has been rescheduled to ${formatDate(date)} at ${slot}.`,
      },
      cancelled: {
        subject: "Appointment Cancelled",
        patientText: `Your appointment with Dr. ${doctor.name} for ${formatDate(
          date
        )} at ${slot} has been cancelled.`,
        doctorText: `Your appointment with ${patient.name} for ${formatDate(
          date
        )} at ${slot} has been cancelled.`,
      },
    };

    const template = emailTemplates[type];

    const emails = await Promise.all([
      transporter.sendMail({
        from: {
          name: "Hospital Appointment System",
          address: process.env.EMAIL_USER,
        },
        to: patient.email,
        subject: template.subject,
        text: template.patientText,
        html: `<div style="font-family: Arial, sans-serif;">
          <h2>${template.subject}</h2>
          <p>${template.patientText}</p>
        </div>`,
      }),
      transporter.sendMail({
        from: {
          name: "Hospital Appointment System",
          address: process.env.EMAIL_USER,
        },
        to: appointmentData.doctor.email,
        subject: template.subject,
        text: template.doctorText,
        html: `<div style="font-family: Arial, sans-serif;">
          <h2>${template.subject}</h2>
          <p>${template.doctorText}</p>
        </div>`,
      }),
    ]);

    console.log(
      "Emails sent successfully:",
      emails.map((e) => e.messageId)
    );
    return true;
  } catch (error) {
    console.error("Email sending failed:", {
      errorMessage: error.message,
      errorCode: error.code,
      errorResponse: error.response,
    });
    return false;
  }
};
