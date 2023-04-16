const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "first Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last Name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is required"],
    },
    email: {
      type: String,
      required: [true, "smail is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    specialization: {
      type: String,
      required: [true, "specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    feesPerConsultation: {
      type: Number,
      required: [true, "fee is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Array,
      required: [true, "timing is required"],
    },
    doctorApplicableCertificate: {
      type: String,
      required: [
        true,
        "Please provide link of certficate which is approval that you can practice as a doctor",
      ],
    },
    description: {
      type: String,
      required: [true, "description is required "],
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("Doctor", doctorSchema);
module.exports = doctorModel;
