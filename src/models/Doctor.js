import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const DayScheduleSchema = new mongoose.Schema(
  {
    isAvailable: {
      type: Boolean,
      default: false,
    },
    slots: [TimeSlotSchema],
  },
  { _id: false }
);

const DoctorSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    specialization: String,
    appointments: [
      {
        date: Date,
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
        status: String,
      },
    ],
    schedule: {
      monday: DayScheduleSchema,
      tuesday: DayScheduleSchema,
      wednesday: DayScheduleSchema,
      thursday: DayScheduleSchema,
      friday: DayScheduleSchema,
      saturday: DayScheduleSchema,
    },
    unavailableDates: [
      {
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          default: "Unavailable",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add method to manage slots
DoctorSchema.methods.addTimeSlot = function (day, startTime, endTime) {
  if (!this.schedule[day]) {
    this.schedule[day] = { isAvailable: true, slots: [] };
  }
  this.schedule[day].slots.push({ startTime, endTime });
  this.schedule[day].slots.sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
};

// Ensure a default export with the collection name "doctors"
export default mongoose.models.Doctor ||
  mongoose.model("Doctor", DoctorSchema, "doctors");
