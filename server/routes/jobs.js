const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");

// GET /api/jobs — list all jobs with optional search & filter
router.get("/", async (req, res) => {
  try {
    const { search, type, status, location } = req.query;
    const query = {};

    if (status) query.status = status;
    else query.status = "Open";

    if (type) query.type = type;
    if (location) query.location = new RegExp(location, "i");
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { company: new RegExp(search, "i") },
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/all — all jobs regardless of status (for dashboard)
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/stats — dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: "Open" });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: "Pending" });
    const acceptedApplications = await Application.countDocuments({ status: "Accepted" });

    const byType = await Job.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    res.json({ totalJobs, openJobs, totalApplications, pendingApplications, acceptedApplications, byType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);
    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/jobs/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Job not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    await Application.deleteMany({ job: req.params.id });
    res.json({ message: "Job and its applications deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:id/applications
router.get("/:id/applications", async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs/:id/apply
router.post("/:id/apply", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status === "Closed") return res.status(400).json({ message: "This job is no longer accepting applications" });

    const application = new Application({ job: req.params.id, ...req.body });
    const saved = await application.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
