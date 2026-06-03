import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["Pending", "Reviewed", "Accepted", "Rejected"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tab, setTab] = useState("jobs");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [s, j, a] = await Promise.all([
      fetch("/api/jobs/stats").then((r) => r.json()),
      fetch("/api/jobs/all").then((r) => r.json()),
      fetch("/api/applications").then((r) => r.json()),
    ]);
    setStats(s);
    setJobs(j);
    setApplications(a);
  }

  async function toggleStatus(jobId, currentStatus) {
    const newStatus = currentStatus === "Open" ? "Closed" : "Open";
    await fetch(`/api/jobs/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchAll();
  }

  async function deleteJob(jobId) {
    if (!window.confirm("Delete this job and all its applications?")) return;
    await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
    fetchAll();
  }

  async function updateAppStatus(appId, status) {
    await fetch(`/api/applications/${appId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAll();
  }

  async function deleteApp(appId) {
    if (!window.confirm("Delete this application?")) return;
    await fetch(`/api/applications/${appId}`, { method: "DELETE" });
    fetchAll();
  }

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Manage your job listings and review applications</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalJobs}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#28a745" }}>{stats.openJobs}</div>
            <div className="stat-label">Open Positions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#e94560" }}>{stats.pendingApplications}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#28a745" }}>{stats.acceptedApplications}</div>
            <div className="stat-label">Accepted</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button className={`btn ${tab === "jobs" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("jobs")}>
          Jobs ({jobs.length})
        </button>
        <button className={`btn ${tab === "apps" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("apps")}>
          Applications ({applications.length})
        </button>
      </div>

      {tab === "jobs" && (
        <div className="table-wrap">
          {jobs.length === 0 ? (
            <div className="empty"><p>No jobs posted yet.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Company</th><th>Type</th><th>Location</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td><strong style={{ cursor: "pointer", color: "#0f3460" }} onClick={() => navigate(`/jobs/${job._id}`)}>{job.title}</strong></td>
                    <td>{job.company}</td>
                    <td>{job.type}</td>
                    <td>{job.location}</td>
                    <td><span className={`tag tag-${job.status === "Open" ? "open" : "closed"}`}>{job.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-outline" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={() => toggleStatus(job._id, job.status)}>
                          {job.status === "Open" ? "Close" : "Reopen"}
                        </button>
                        <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={() => deleteJob(job._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "apps" && (
        <div className="table-wrap">
          {applications.length === 0 ? (
            <div className="empty"><p>No applications yet.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Applicant</th><th>Email</th><th>Job</th><th>Status</th><th>Applied</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td><strong>{app.applicantName}</strong>{app.phone && <div style={{ fontSize: "0.8rem", color: "#666" }}>{app.phone}</div>}</td>
                    <td>{app.applicantEmail}</td>
                    <td>{app.job?.title} <span style={{ color: "#999", fontSize: "0.8rem" }}>@ {app.job?.company}</span></td>
                    <td>
                      <select
                        className="status-select"
                        value={app.status}
                        onChange={(e) => updateAppStatus(app._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={() => deleteApp(app._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
