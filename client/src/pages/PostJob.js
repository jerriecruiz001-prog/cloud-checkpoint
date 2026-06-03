import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EMPTY = {
  title: "", company: "", location: "", type: "Full-time",
  salaryMin: "", salaryMax: "", description: "", requirements: "", status: "Open",
};

export default function PostJob() {
  const [form, setForm] = useState(EMPTY);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        title: form.title,
        company: form.company,
        location: form.location,
        type: form.type,
        status: form.status,
        description: form.description,
        requirements: form.requirements
          ? form.requirements.split("\n").map((r) => r.trim()).filter(Boolean)
          : [],
        salary: {
          min: form.salaryMin ? Number(form.salaryMin) : undefined,
          max: form.salaryMax ? Number(form.salaryMax) : undefined,
        },
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate(`/jobs/${data._id}`);
    } catch (err) {
      setAlert(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Post a Job</h1>
        <p>Fill in the details to publish a new job listing</p>
      </div>

      {alert && <div className="alert alert-error">{alert}</div>}

      <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input required placeholder="e.g. Senior React Developer" value={form.title} onChange={set("title")} />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input required placeholder="e.g. Acme Corp" value={form.company} onChange={set("company")} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input required placeholder="e.g. New York, NY or Remote" value={form.location} onChange={set("location")} />
            </div>
            <div className="form-group">
              <label>Job Type *</label>
              <select value={form.type} onChange={set("type")}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary Min (USD)</label>
              <input type="number" placeholder="e.g. 60000" value={form.salaryMin} onChange={set("salaryMin")} />
            </div>
            <div className="form-group">
              <label>Salary Max (USD)</label>
              <input type="number" placeholder="e.g. 90000" value={form.salaryMax} onChange={set("salaryMax")} />
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea required rows={5} placeholder="Describe the role, responsibilities, and what makes it exciting..." value={form.description} onChange={set("description")} />
          </div>

          <div className="form-group">
            <label>Requirements <span style={{ fontWeight: 400, color: "#999" }}>(one per line)</span></label>
            <textarea rows={4} placeholder={"3+ years React experience\nStrong TypeScript skills\nExperience with REST APIs"} value={form.requirements} onChange={set("requirements")} />
          </div>

          <div className="form-group" style={{ maxWidth: 200 }}>
            <label>Status</label>
            <select value={form.status} onChange={set("status")}>
              <option>Open</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Job"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
