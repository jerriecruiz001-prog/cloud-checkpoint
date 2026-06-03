import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ applicantName: "", applicantEmail: "", phone: "", coverLetter: "", portfolioUrl: "" });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then(setJob);
  }, [id]);

  async function handleApply(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAlert({ type: "success", text: "Application submitted! Good luck." });
      setShowApply(false);
      setForm({ applicantName: "", applicantEmail: "", phone: "", coverLetter: "", portfolioUrl: "" });
    } catch (err) {
      setAlert({ type: "error", text: err.message });
    }
    setSubmitting(false);
  }

  function formatSalary(salary) {
    if (!salary?.min && !salary?.max) return "Not specified";
    const fmt = (n) => `$${n.toLocaleString()}`;
    if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)} / yr`;
    if (salary.min) return `From ${fmt(salary.min)} / yr`;
    return `Up to ${fmt(salary.max)} / yr`;
  }

  if (!job) return <p className="empty">Loading...</p>;

  return (
    <>
      <a className="back-btn" onClick={() => navigate(-1)} href="#back">← Back to Jobs</a>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.text}</div>
      )}

      <div className="job-detail">
        <h1>{job.title}</h1>
        <div className="meta">
          <span className="tag tag-type">{job.type}</span>
          <span className="tag tag-location">{job.location}</span>
          <span className={`tag tag-${job.status === "Open" ? "open" : "closed"}`}>{job.status}</span>
        </div>

        <div className="action-bar">
          <div>
            <strong style={{ fontSize: "1.1rem" }}>{job.company}</strong>
            <div className="salary" style={{ marginTop: 4 }}>{formatSalary(job.salary)}</div>
          </div>
          {job.status === "Open" && (
            <button className="btn btn-primary" onClick={() => setShowApply(true)}>
              Apply Now
            </button>
          )}
        </div>

        <div className="section">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>

        {job.requirements?.length > 0 && (
          <div className="section">
            <h2>Requirements</h2>
            <ul>
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </div>

      {showApply && (
        <div className="modal-overlay" onClick={() => setShowApply(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for {job.title}</h2>
            <form onSubmit={handleApply}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input required value={form.applicantName} onChange={(e) => setForm({ ...form, applicantName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required value={form.applicantEmail} onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Portfolio / LinkedIn URL</label>
                  <input value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} placeholder="Tell us why you're a great fit..." />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowApply(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
