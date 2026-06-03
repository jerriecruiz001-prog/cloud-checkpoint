const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicantName: { type: String, required: [true, "Name is required"], trim: true },
    applicantEmail: { type: String, required: [true, "Email is required"], lowercase: true, trim: true },
    phone: { type: String, trim: true },
    coverLetter: { type: String },
    portfolioUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
