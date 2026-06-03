const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Job title is required"], trim: true },
    company: { type: String, required: [true, "Company name is required"], trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote", "Contract", "Internship"],
      required: true,
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "USD" },
    },
    description: { type: String, required: [true, "Description is required"] },
    requirements: [{ type: String }],
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
