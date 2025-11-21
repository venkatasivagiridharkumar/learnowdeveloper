import React, { useEffect, useState, useMemo } from "react";
import "./index.css";

const API_URL = "https://learnowbackmongo.onrender.com/jobs";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryId, setQueryId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (mounted) setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch jobs error:", err);
        if (mounted) setError(err.message || "Failed to load jobs");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [refreshKey]);

  // Filter by id (partial or full). If query empty => show all.
  const filtered = useMemo(() => {
    const q = (queryId || "").trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((job) => {
      const id = job.id == null ? "" : String(job.id).toLowerCase();
      return id.includes(q);
    });
  }, [jobs, queryId]);

  return (
    <div className="jobs-root">
      <div className="jobs-topbar">
        <h1 className="jobs-title">Jobs</h1>

        <div className="jobs-controls">
          <input
            className="jobs-search"
            type="search"
            placeholder="Search by ID (partial or full)..."
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            aria-label="Search jobs by id"
          />

          <button
            className="jobs-btn"
            onClick={() => setRefreshKey((k) => k + 1)}
            aria-label="Refresh jobs"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="jobs-state">Loading jobs…</div>
      ) : error ? (
        <div className="jobs-state jobs-error">Error: {error} <button className="jobs-btn small" onClick={() => setRefreshKey(k => k + 1)}>Retry</button></div>
      ) : filtered.length === 0 ? (
        <div className="jobs-state">No jobs found{queryId ? ` for ID "${queryId}"` : "."}</div>
      ) : (
        <div className="jobs-list">
          {filtered.map((job, i) => {
            const {
              id,
              company,
              role,
              link,
              ctc,
              description,
              technologies,
              location,
              last_date,
            } = job;

            return (
              <article className="job-row" key={id ?? `job-${i}`}>
                <div className="job-left">
                  <div className="job-id">{id ?? "—"}</div>
                  <div className="job-company">{company ?? "Unknown"}</div>
                </div>

                <div className="job-main">
                  <div className="job-header">
                    <h2 className="job-role">{role ?? "Role not specified"}</h2>
                    <div className="job-ctc">{ctc ?? "—"}</div>
                  </div>

                  <p className="job-desc">{description ?? "No description provided."}</p>

                  <div className="job-meta">
                    <div><strong>Technologies:</strong> {technologies ?? "—"}</div>
                    <div><strong>Location:</strong> {location ?? "—"}</div>
                    <div><strong>Last Date:</strong> {last_date ?? "—"}</div>
                  </div>

                  <div className="job-actions">
                    {link ? (
                      // If link looks like a URL, open in new tab; otherwise treat as label
                      /^https?:\/\//i.test(String(link)) ? (
                        <a className="btn-primary" href={link} target="_blank" rel="noopener noreferrer">Apply ↗</a>
                      ) : (
                        <span className="btn-ghost disabled">{String(link)}</span>
                      )
                    ) : (
                      <span className="btn-ghost disabled">No link</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Jobs;
