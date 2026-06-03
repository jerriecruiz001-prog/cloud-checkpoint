import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [search, type]);

  async function fetchJobs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  function formatSalary(salary) {
    if (!salary?.min && !salary?.max) return null;
    const fmt = (n) => `$${(n / 1000).toFixed(0)}k`;
    if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)}`;
    if (salary.min) return `From ${fmt(salary.min)}`;
    return `Up to ${fmt(salary.max)}`;
  }

  return (
    <>
      <div className="page-header">
        <h1>Find Your Next Job</h1>
        <p>{jobs.length} open position{jobs.length !== 1 ? "s" : ""} available</p>
      </div>

      <div className="filter-bar">
        <input
          placeholder="Search job title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Remote</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
        {(search || type) && (
          <button className="btn btn-outline" onClick={() => { setSearch(""); setType(""); }}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p className="empty">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="empty">
          <p>No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className={`tag tag-${job.status === "Open" ? "open" : "closed"}`}>{job.status}</span>
              </div>
              <div className="company">{job.company}</div>
              <div className="meta">
                <span className="tag tag-type">{job.type}</span>
                <span className="tag tag-location">{job.location}</span>
              </div>
              {formatSalary(job.salary) && (
                <div className="salary">{formatSalary(job.salary)}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
