import React, { useState } from "react";
import "./index.css";

const API_BASE = "https://learnowbackmongo.onrender.com/delete-jobs";

const DeleteJob = () => {
  const [jobId, setJobId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const clearMsg = () => setMessage(null);

  const handleChange = (e) => {
    setJobId(e.target.value);
    if (message) clearMsg();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const id = (jobId || "").toString().trim();
    if (!id) {
      setMessage({ type: "error", text: "Please enter a job ID." });
      return;
    }

    const confirmed = window.confirm(`Permanently delete job with ID "${id}"?`);
    if (!confirmed) return;

    setSubmitting(true);
    setMessage({ type: "info", text: "Deleting..." });

    try {
      const url = `${API_BASE}/${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: "DELETE" });

      let json = null;
      try { json = await res.json(); } catch {}

      if (!res.ok) {
        const text = (json && (json.message || JSON.stringify(json))) || `Server responded with ${res.status}`;
        setMessage({ type: "error", text });
      } else {
        const successText = (json && (json.message || `Deleted job ${id}`)) || `Deleted job ${id}`;
        setMessage({ type: "success", text: successText });
        setJobId("");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dj-root">
      <h2 className="dj-title">Delete Job</h2>

      <form className="dj-form" onSubmit={handleDelete} noValidate>
        <label className="dj-label" htmlFor="jobId">Job ID</label>
        <input
          id="jobId"
          className="dj-input"
          value={jobId}
          onChange={handleChange}
          placeholder="Enter job id (e.g. 1234)"
          aria-label="Job ID"
          disabled={submitting}
        />

        <div className="dj-actions">
          <button
            type="submit"
            className="dj-delete"
            disabled={submitting || !jobId.trim()}
            aria-disabled={submitting || !jobId.trim()}
          >
            {submitting ? "Deleting..." : "Delete Job"}
          </button>

          <button
            type="button"
            className="dj-clear"
            onClick={() => { setJobId(""); setMessage(null); }}
            disabled={submitting}
          >
            Clear
          </button>
        </div>

        {message && (
          <div
            role="status"
            className={`dj-message ${message.type === "success" ? "dj-success" : ""} ${message.type === "error" ? "dj-error" : ""}`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default DeleteJob;
