# Hospital Management System

A modern web application for managing hospital appointments, patient records, and doctor schedules.

🌐 **Live Demo:** [https://frontend-uk4g.vercel.app/](https://frontend-uk4g.vercel.app/)

📹 **Demo Video:** [Watch Project Demo](Agoro%20AI%20Video%20Submission.mp4)

## Features

- 🏥 Patient Management

  - Registration and authentication
  - Appointment booking and management
  - Medical record access
  - Profile management

- 👨‍⚕️ Doctor Management

  - Authentication and dashboard
  - Patient records access
  - Appointment management
  - Schedule management

- 📅 Appointment System
  - Real-time slot availability
  - Email notifications
  - Rescheduling and cancellation
  - Appointment history

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Email**: Nodemailer
- **Styling**: TailwindCSS

## Quick Start

1. **Visit the Live Demo**
   - Go to [https://frontend-uk4g.vercel.app/](https://frontend-uk4g.vercel.app/)
   - Try the demo credentials:
     - Doctor login: doctor@example.com / password123
     - Patient login: patient@example.com / password123

2. **Or Run Locally**
   ```bash
   git clone https://github.com/yashpatle23/frontend.git
   cd frontend
   npm install
   npm run dev
   ```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yashpatle23/frontend.git
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable React components
│   ├── models/        # Mongoose models
│   ├── pages/         # Next.js pages and API routes
│   ├── styles/        # Global styles and Tailwind config
│   └── utils/         # Helper functions and utilities
├── public/           # Static files
└── ...config files
```

## API Routes

- **Authentication**

  - `POST /api/auth/login`
  - `POST /api/auth/register`

- **Appointments**

  - `GET /api/appointments`
  - `POST /api/appointments`
  - `PUT /api/appointments/:id`
  - `DELETE /api/appointments/:id`

- **Patients**

  - `GET /api/patients`
  - `GET /api/patients/:id`
  - `PUT /api/patients/:id`

- **Doctors**
  - `GET /api/doctors`
  - `GET /api/doctors/:id`
  - `PUT /api/doctors/:id`

## Demo Video

Watch our project demonstration video to see all features in action:
- Full walkthrough of patient and doctor interfaces
- Appointment booking process
- Medical records management
- Real-time notifications
- Mobile responsiveness

[Download Demo Video](Agoro%20AI%20Video%20Submission.mp4)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


