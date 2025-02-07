import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g. smtp.example.com
  port: process.env.EMAIL_PORT, // e.g. 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // e.g. '"Clinic" <noreply@clinic.com>'
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}
